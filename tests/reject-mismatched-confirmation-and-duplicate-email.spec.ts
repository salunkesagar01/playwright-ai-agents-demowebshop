import { test, expect } from '@playwright/test';

test.describe('Registration', () => {
  test('Reject mismatched confirmation and duplicate email', async ({ page }) => {
    const email = `copilot.edge.${Date.now()}@example.com`;
    const password = 'DemoPass123!';

    // 1. Assumption: use a fresh context and a unique disposable email. Enter otherwise-valid registration data but use different password and confirmation values, then submit.
    await page.goto('https://demowebshop.tricentis.com/register');
    await page.locator('#FirstName').fill('Copilot');
    await page.locator('#LastName').fill('Test');
    await page.locator('#Email').fill(email);
    await page.locator('#Password').fill(password);
    await page.locator('#ConfirmPassword').fill('Different123!');
    await page.locator('#register-button').click();
    await expect(page.getByText('The password and confirmation password do not match.')).toBeVisible();

    // 2. Correct the confirmation and complete registration. Sign out, open Register again, and submit valid details using the already-registered email.
    await page.locator('#ConfirmPassword').fill(password);
    await page.locator('#register-button').click();
    await expect(page.getByText('Your registration completed')).toBeVisible();
    await page.locator("a[href='/logout']").click();
    await page.goto('https://demowebshop.tricentis.com/register');
    await page.locator('#FirstName').fill('Copilot');
    await page.locator('#LastName').fill('Test');
    await page.locator('#Email').fill(email);
    await page.locator('#Password').fill(password);
    await page.locator('#ConfirmPassword').fill(password);
    await page.locator('#register-button').click();
    await expect(page.getByText('The specified email already exists')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();
  });
});