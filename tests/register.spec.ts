import { expect, test } from '@playwright/test';
import { localization } from '../src/server/common/localization';
const usernamePrefix = 'playwright-test-';
const username = usernamePrefix + (new Date()).getTime();
const badPassword = 'password';
const goodPassword = 'password1234';
test('has title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle("Neverall Forums");
    await page.getByTestId('toggle-account-menu').click();
    await page.getByTestId('header-sub-sign-up').click();

    await page.getByTestId('register-form-username').fill('2');
    await expect(page.getByText('length must be at least 3 characters long')).toBeVisible();
    await page.getByTestId('register-form-username').fill(username);
    await expect(page.getByText('length must be at least 3 characters long')).not.toBeVisible();

    await page.getByTestId('register-form-password').fill(badPassword);
    await expect(page.getByText(localization('strongerPassword'))).toBeVisible();
    await page.getByTestId('register-form-password').fill(goodPassword);
    await expect(page.getByText(localization('strongerPassword'))).not.toBeVisible();

    await page.getByTestId('register-form-retype_password').fill(badPassword);
    await expect(page.getByText('Passwords do not match')).toBeVisible();
    await page.getByTestId('register-form-retype_password').fill(goodPassword);
    await expect(page.getByText('Passwords do not match')).not.toBeVisible();


});