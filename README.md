# 🎭 Latvian Roguelite Learning Web Game + Playwright Automation Framework

A polished, browser-based Latvian language learning game built with a roguelite structure, featuring automated end-to-end testing verification via Playwright.

🔗 **Live Game Demo:**  https://dorians1337.github.io/lv-learning-app/

---

## 🚀 Core Features

- **Gamified Progression:** Multi-tier vocabulary and grammar progression loops (from basic spelling traps to advanced fill-in-the-blanks).
- **Game Economy & Risk Management:** Dynamic heart counters (❤️🖤💛🤍) acting as both health shields and hints currency.
- **Smart Hint System:** Deducts currency to randomly eliminate wrong options based on strict business logic constraints.
- **Mistake Review Engine:** Post-defeat logs that allow users to study their mistakes for enhanced educational memory retention.

## 🛠️ Automation & Testing Suite (Playwright)

To guarantee software stability and code quality, a robust end-to-end test framework was established. By decoupling the randomized production gameplay into a controlled, deterministic "Stage 1 Playground", the framework reliably tests complex conditional states.

### Key Automated Test Scenarios Validated:
1. **Core Navigation:** Validates live application deployment, landing screen renders, and state changes upon `DESCEND`.
2. **Streak Mechanics:** Simulates full deterministic question loops to ensure correct strike tracking logic.
3. **Shop Validation:** Asserts visual triggers, state transitions, and validation behavior for purchasing gold and black hearts.
4. **Cross-Browser Verification:** Fully tested and running smoothly across multiple separate browser threads (**Chromium**, **Firefox**, and **WebKit**).

---

## 💻 How to Run the Test Suite Locally

If you want to pull this project locally and inspect the automated scripts, run the following commands in your terminal:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Dorians1337/lv-learning-app.git
   cd lv-learning-app
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Run the Playwright E2E test scripts:**
   ```bash
   npx playwright test game
   ```

4. **Open the interactive testing UI (Optional):**
   ```bash
   npx playwright test --ui
   ```
