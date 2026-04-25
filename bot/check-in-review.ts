import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();

  const context = await browser.newContext({
    storageState: "auth.json",
  });

  const page = await context.newPage();

  let xssTriggered = false;

  page.on("dialog", async (dialog) => {
    xssTriggered = true;
    await dialog.accept();
  });

  await page.goto("http://localhost:3000/in-review");
  await page.waitForSelector(".post");

  const posts = await page.$$eval(".post", (els) =>
    els.map((el) => ({
      id: el.getAttribute("data-id"),
      title: el.querySelector(".post-title")?.textContent?.trim() ?? "",
      content: el.querySelector(".post-content")?.textContent?.trim() ?? "",
    })),
  );

  console.log(`Found ${posts.length} posts`);

  for (const post of posts) {
    if (!post.id) continue;

    xssTriggered = false;

    await page.goto("http://localhost:3000/in-review");

    const selector = `[data-id="${post.id}"]`;
    await page.waitForSelector(selector);

    await page.hover(selector);
    await page.click(selector);

    await page.waitForTimeout(300);

    if (xssTriggered) {
      const res = await context.request.get(
        `http://localhost:3000/api/set-successful-xss?id=${post.id}`,
      );

      console.log(`Marked XSS → ${res.status()}`);
    } else {
      console.log(`No XSS in post ${post.id}`);
    }

    const allowedRes = await context.request.get(
      `http://localhost:3000/api/set-allowed?id=${post.id}`,
    );

    console.log(`Marked allowed → ${allowedRes.status()}`);
  }

  await browser.close();
}

main();
