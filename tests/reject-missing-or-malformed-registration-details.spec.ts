import { test, expect } from '@playwright/test';

test.describe('Registration', () => {
  test('Reject missing or malformed registration details', async ({ page }) => {
    // 1. Assumption: start in a fresh browser context. Open Register and submit the form with all fields blank.
    await page.goto('https://demowebshop.tricentis.com/register');
    await page.locator('#register-button').click();
    await expect(page.getByText('First name is required.')).toBeVisible();
    await expect(page.getByText('Last name is required.')).toBeVisible();
    await expect(page.getByText('Email is required.')).toBeVisible();
    await expect(page.getByText('Password is required.').first()).toBeVisible();

    // 2. Enter a malformed email and a password that does not meet the site's minimum length; submit.
    await page.locator('#FirstName').fill('Copilot');
    await page.locator('#LastName').fill('Test');
    await page.locator('#Email').fill('not-an-email');
    await page.locator('#Password').fill('123');
    await page.locator('#ConfirmPassword').fill('123');
    await page.locator('#register-button').click();
    await expect(page.getByText('Wrong email')).toBeVisible();
    await expect(page.getByText('The password should have at least 6 characters.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();
  });
});