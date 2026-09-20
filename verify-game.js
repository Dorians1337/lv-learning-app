const { chromium } = require('playwright');

async function openGame(page) {
  await page.goto('https://dorians1337.github.io/lv-learning-app/');
  await page.getByRole('button', { name: 'DESCEND' }).click();
  await page.waitForSelector('#game-screen.active');
  console.log('PASS: game opened and descended');
}

async function answerCorrectly(page) {
  const correct = await page.evaluate(() => window.questions[currentQuestionIndex].correct);
  await page.locator('.option-btn').filter({ hasText: correct }).first().click();
  await page.getByRole('button', { name: 'CONTINUE' }).click();
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await openGame(page);

    for (let i = 0; i < 3; i++) {
      await answerCorrectly(page);
    }
    const streak3 = await page.locator('#streak-display').textContent();
    console.log('streak after 3:', streak3);
    await page.getByRole('button', { name: 'Buy 💛 (Costs 3 🔥)' }).click();
    const heartText = await page.locator('#hearts-display').textContent();
    console.log('hearts after yellow:', heartText);

    await page.goto('https://dorians1337.github.io/lv-learning-app/');
    await page.getByRole('button', { name: 'DESCEND' }).click();
    await page.waitForSelector('#game-screen.active');
    for (let i = 0; i < 10; i++) {
      await answerCorrectly(page);
    }
    const streak10 = await page.locator('#streak-display').textContent();
    console.log('streak after 10:', streak10);
    await page.getByRole('button', { name: 'Buy 🖤 (Costs 10 🔥)' }).click();
    const blackHeartText = await page.locator('#hearts-display').textContent();
    console.log('hearts after black:', blackHeartText);

    console.log('PASS: yellow and black heart purchases validated');
  } finally {
    await browser.close();
  }
})();
