const { test, expect } = require('@playwright/test');

async function openGame(page) {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'DESCEND' })).toBeVisible();
  await page.getByRole('button', { name: 'DESCEND' }).click();
  await expect(page.locator('#game-screen')).toHaveClass(/active/);
}

async function answerCurrentQuestionCorrectly(page) {
  const current = await page.evaluate(() => {
    return window.questions[currentQuestionIndex].correct;
  });

  const button = page.locator('.option-btn').filter({ hasText: current }).first();
  await button.click();
  await expect(page.locator('#check-action')).toHaveText('CONTINUE');
  await page.locator('#check-action').click();
}

test('game opens and the stage 1 playground is fixed and inspectable', async ({ page }) => {
  await openGame(page);

  const firstQuestion = await page.evaluate(() => ({
    currentTier: window.currentTier,
    questionsLength: window.questions.length,
    firstPrompt: window.questions[0].prompt,
    firstCorrect: window.questions[0].correct,
    firstOptions: window.questions[0].options
  }));

  expect(firstQuestion.currentTier).toBe(1);
  expect(firstQuestion.questionsLength).toBeGreaterThan(0);
  expect(firstQuestion.firstPrompt).toBe("Select the correct spelling for 'Hello':");
  expect(firstQuestion.firstCorrect).toBe('Sveiki');
  expect(firstQuestion.firstOptions[0]).toBe('Sveķi');
  expect(firstQuestion.firstOptions[1]).toBe('Sveiki');
});

test('player can complete the preset stage 1 playground and buy a yellow heart', async ({ page }) => {
  await openGame(page);

  for (let i = 0; i < 3; i++) {
    await answerCurrentQuestionCorrectly(page);
  }

  await expect(page.locator('#streak-display')).toHaveText('🔥 Streak: 3');
  await expect(page.locator('#shop-btn')).toBeEnabled();
  await page.getByRole('button', { name: 'Buy 💛 (Costs 3 🔥)' }).click();

  await expect(page.locator('#hearts-display')).toContainText('💛');
  await expect(page.locator('#streak-display')).toHaveText('🔥 Streak: 0');
});

test('yellow heart hint removes one wrong option', async ({ page }) => {
  await openGame(page);

  for (let i = 0; i < 3; i++) {
    await answerCurrentQuestionCorrectly(page);
  }

  await page.getByRole('button', { name: 'Buy 💛 (Costs 3 🔥)' }).click();
  await expect(page.locator('#hint-action')).toBeEnabled();

  const wrongOptions = await page.evaluate(() => {
    const q = window.questions[window.currentQuestionIndex];
    return q.options.filter((option) => option !== q.correct);
  });

  const beforeDisabledCount = await page.locator('.option-btn:disabled').count();
  await page.locator('#hint-action').click();

  const disabledText = await page.locator('.option-btn:disabled').evaluateAll((buttons) =>
    buttons.map((button) => button.textContent.replace(/^\d+\.\s*/, ''))
  );

  expect(beforeDisabledCount).toBe(0);
  expect(disabledText.some((text) => wrongOptions.includes(text))).toBeTruthy();
  await expect(page.locator('#feedback')).toContainText('Hint used: one wrong option removed.');
});

test('black heart cracks into a white heart and the white heart is destroyed on the next wrong answer', async ({ page }) => {
  await openGame(page);

  for (let i = 0; i < 10; i++) {
    await answerCurrentQuestionCorrectly(page);
  }

  await expect(page.locator('#streak-display')).toHaveText('🔥 Streak: 10');
  await page.getByRole('button', { name: 'Buy 🖤 (Costs 10 🔥)' }).click();
  await expect(page.locator('#hearts-display')).toContainText('🖤');

  const wrongAnswer = await page.evaluate(() => {
    const q = window.questions[window.currentQuestionIndex];
    return q.options.find((option) => option !== q.correct);
  });

  await page.locator('.option-btn').filter({ hasText: wrongAnswer }).first().click();

  await expect(page.locator('#feedback')).toContainText('Black Heart cracked into a White Heart.');
  await expect(page.locator('#hearts-display')).toContainText('🤍');
  await expect(page.locator('#hearts-display')).not.toContainText('🖤');

  await page.locator('#check-action').click();

  const nextWrongAnswer = await page.evaluate(() => {
    const q = window.questions[window.currentQuestionIndex];
    return q.options.find((option) => option !== q.correct);
  });

  await page.locator('.option-btn').filter({ hasText: nextWrongAnswer }).first().click();
  await expect(page.locator('#feedback')).toContainText('White Heart destroyed.');
  await expect(page.locator('#hearts-display')).not.toContainText('🤍');
});
