import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:3000");
  console.log("✅ Successfully loaded the page");
  await browser.close();
  console.log("✅ Bot completed successfully");
}

main();
