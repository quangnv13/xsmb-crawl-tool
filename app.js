const puppeteer = require("puppeteer");
const db = require("./db");

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const runCrawl = async () => {
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    headless: true,
  });

  const page = await browser.newPage();
  let crawingDate = new Date("08/18/2007");

  while (true) {
    await page.goto(
      `https://xoso.com.vn/xsmb-${
        crawingDate.getDate() >= 10
          ? crawingDate.getDate()
          : "0" + crawingDate.getDate()
      }-${
        crawingDate.getMonth() + 1 >= 10
          ? crawingDate.getMonth() + 1
          : "0" + (crawingDate.getMonth() + 1)
      }-${crawingDate.getFullYear()}.html`,
      {
        waitUntil: "load",
      }
    );

    try {
      const allPrize = await page.evaluate(() => {
        const special = document
          .querySelectorAll("span.special-prize")[0]
          .textContent.trim();

        const prize1 = document
          .querySelectorAll("span.prize1")[0]
          .textContent.trim();

        let prize2 = [];
        document.querySelectorAll("span.prize2").forEach((prize) => {
          prize2 = [...prize2, prize.textContent.trim()];
        });
        let prize3 = [];
        document.querySelectorAll("span.prize3").forEach((prize) => {
          prize3 = [...prize3, prize.textContent.trim()];
        });
        let prize4 = [];
        document.querySelectorAll("span.prize4").forEach((prize) => {
          prize4 = [...prize4, prize.textContent.trim()];
        });
        let prize5 = [];
        document.querySelectorAll("span.prize5").forEach((prize) => {
          prize5 = [...prize5, prize.textContent.trim()];
        });
        let prize6 = [];
        document.querySelectorAll("span.prize6").forEach((prize) => {
          prize6 = [...prize6, prize.textContent.trim()];
        });
        let prize7 = [];
        document.querySelectorAll("span.prize7").forEach((prize) => {
          prize7 = [...prize7, prize.textContent.trim()];
        });

        return {
          special,
          prize1,
          prize2,
          prize3,
          prize4,
          prize5,
          prize6,
          prize7,
        };
      });

      if (allPrize.prize7.includes("...")) {
        await sleep(60000);
        continue;
      }

      db.get("prizes")
        .push({ time: crawingDate.getTime() / 1000, allPrizes: allPrize })
        .write();
    } catch {}

    crawingDate.setDate(crawingDate.getDate() + 1);
  }
};

runCrawl();
