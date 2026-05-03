import { BrowserContext, chromium, Page } from "playwright";

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
  let xssTriggered = false;

  // Reset dialog handler each run
  page.removeAllListeners("dialog");
  page.on("dialog", async (dialog) => {
    xssTriggered = true;
    await dialog.accept();
  });

  console.log(`Processing post ${postId}`);

  try {
    await page.goto(`${BASE_URL}/in-review`);

    const selector = `[data-id="${postId}"]`;

    await page.waitForSelector(selector, { timeout: 5000 });

    // Click post (if clickable)
    await page.click(selector, { timeout: 3000 }).catch(() => {
      console.log(`Post ${postId} not clickable, skipping click`);
    });

    await page.waitForTimeout(300);

    if (xssTriggered) {
      const res = await context.request.get(
        `${BASE_URL}/api/set-successful-xss?id=${postId}`,
      );
      console.log(`XSS detected → ${postId}`, await res.text());
    } else {
      console.log(`Clean post → ${postId}`);
    }

    // Always mark as reviewed (IMPORTANT)
    const res = await context.request.get(
      `${BASE_URL}/api/set-allowed?id=${postId}`,
    );

    console.log(`Set allowed → ${postId}`, await res.text());
  } catch (err) {
    console.log(`Error processing ${postId}:`, err);
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    storageState: "auth.json",
  });

  const page = await context.newPage();

  console.log("CTF bot running...");

  while (true) {
    try {
      const posts = await getPosts(page);

      if (!posts.length) {
        console.log("No posts in review");
      }

      for (const post of posts) {
        if (!post.id) continue;

        await processPost(page, context, post.id);
      }
    } catch (err) {
      console.log("Loop error (ignored):", err);
    }

    await new Promise((r) => setTimeout(r, POLL_INTERVAL));
  }
}

main();
