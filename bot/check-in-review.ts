import { chromium, Page, BrowserContext } from "playwright";

const BASE_URL = "http://localhost:3000";
const POLL_INTERVAL = 3000;

async function getPosts(page: Page) {
  await page.goto(`${BASE_URL}/in-review`);
  await page.waitForLoadState("networkidle");

  return await page.$$eval(".post", (els) =>
    els.map((el) => ({
      id: el.getAttribute("data-id"),
    })),
  );
}

async function processPost(
  page: Page,
  context: BrowserContext,
  postId: string,
) {
  const xssTriggered = { value: false };

  page.removeAllListeners("dialog");
  page.on("dialog", async (dialog) => {
    xssTriggered.value = true;
    await dialog.accept();
  });

  await page.goto(`${BASE_URL}/in-review`);

  const selector = `[data-id="${postId}"]`;

  try {
    await page.waitForSelector(selector, { timeout: 5000 });
    await page.hover(selector);
    await page.click(selector);
  } catch {
    console.log(`Skipping ${postId} (not clickable)`);
    return;
  }

  await page.waitForTimeout(300);

  if (xssTriggered.value) {
    await context.request.get(
      `${BASE_URL}/api/set-successful-xss?id=${postId}`,
    );
    console.log(`XSS detected → ${postId}`);
  } else {
    console.log(`Clean post → ${postId}`);
  }

  await context.request.get(`${BASE_URL}/api/set-allowed?id=${postId}`);
}

async function main() {
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    storageState: "auth.json",
  });

  const page = await context.newPage();

  // Track already processed posts
  const processed = new Set<string>();

  console.log("CTF bot running...");

  while (true) {
    try {
      const posts = await getPosts(page);

      for (const post of posts) {
        if (!post.id) continue;
        if (processed.has(post.id)) continue;

        processed.add(post.id);

        await processPost(page, context, post.id);
      }
    } catch (err) {
      console.log("Loop error (ignored):", err);
    }

    await new Promise((r) => setTimeout(r, POLL_INTERVAL));
  }
}

main();
