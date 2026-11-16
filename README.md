# Playwright AI Agents: Demo Web Shop

End-to-end test automation for https://demowebshop.tricentis.com/ using
Playwright with TypeScript and Playwright's AI agents (Planner, Generator, Healer).

## What this project does
- **Planner** explored the site and produced `specs/demowebshop-test-plan.md`
- **Generator** converted the plan into Playwright tests in `tests/`
- **Healer** fixed failing tests

## Tech stack
Playwright, TypeScript, Node.js

## Covered flows
Registration, login/logout, search, category browsing, product details,
cart, wishlist, checkout, order history

## How to run
npm install
npx playwright install
npx playwright test
npx playwright show-report

## Author
Sagar Salunke, QA Lead
