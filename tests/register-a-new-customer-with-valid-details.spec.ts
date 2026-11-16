import { test, expect } from '@playwright/test';

test.describe('Registration', () => {
  test('Register a new customer with valid details', async ({ page }) => {
    const email = `copilot.demo.${Date.now()}@example.com`;
    const password = 'DemoPass123!';

    // 1. Assumption: start in a fresh browser context with no account for the unique test email. Open Register.
    await page.goto('https://demowebshop.tricentis.com/register');
    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();

    // 2. Enter a valid first name, last name, unique valid email, password meeting the site's rules, and the same value in Confirm password. Select a gender if desired, then submit Register.
    await page.locator('#FirstName').fill('Copilot');
    await page.locator('#LastName').fill('Test');
    await page.locator('#Email').fill(email);
    await page.locator('#Password').fill(password);
    await page.locator('#ConfirmPassword').fill(password);
    await page.locator('#register-button').click();

    await expect(page.getByText('Your registration completed')).toBeVisible();
    await expect(page.getByRole('link', { name: email })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log out' })).toBeVisible();
  });
});