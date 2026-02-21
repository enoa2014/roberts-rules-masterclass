import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import { isRemoteE2E, e2eBaseURL } from './utils/e2e-env';

test.beforeAll(async () => {
    if (isRemoteE2E) {
        return;
    }
    try {
        execSync('npm run smoke:seed', { stdio: 'ignore' });
    } catch (e) {
        console.error("Failed to seed users", e);
    }
});

const THEMES = [
    'classic',
    'charcoal-grid',
    'copper-lecture',
    'festival-civic',
    'mint-campaign'
];

test.describe('Course Page Theme Rendering', () => {
    for (const theme of THEMES) {
        test(`should render /course correctly under ${theme} theme`, async ({ page }) => {
            // First we need to login so /course does not redirect
            await page.goto('/login');
            await page.getByTestId('login-username').fill('smoke_teacher');
            await page.getByTestId('login-password').fill('SmokePass123!');
            await page.getByTestId('login-submit').click();
            await expect(page).toHaveURL('/');

            await page.context().addCookies([{
                name: 'app-theme',
                value: theme,
                domain: new URL(e2eBaseURL).hostname,
                path: '/'
            }]);

            // Navigate to course page
            await page.goto('/course', { waitUntil: 'networkidle' });

            // Depending on theme, basic content must exist
            const h1 = page.locator('h1');
            await h1.waitFor();
            await expect(h1).toBeVisible();

            // At least one course or stats element is present
            await expect(page.locator('button.group').last()).toBeVisible();

            // Test for specific theme identifiers (checking their exact CSS prefix existence via dom classes)
            if (theme === 'charcoal-grid') {
                const hasThemeClass = await page.evaluate(() => document.querySelector('[class*="cg_"]') !== null);
                expect(hasThemeClass).toBeTruthy();
            } else if (theme === 'festival-civic') {
                const hasThemeClass = await page.evaluate(() => document.querySelector('[class*="fc_"]') !== null);
                expect(hasThemeClass).toBeTruthy();
            } else if (theme === 'copper-lecture') {
                const hasThemeClass = await page.evaluate(() => document.querySelector('[class*="cl_"]') !== null);
                expect(hasThemeClass).toBeTruthy();
            } else if (theme === 'mint-campaign') {
                const hasThemeClass = await page.evaluate(() => document.querySelector('[class*="mc_"]') !== null);
                expect(hasThemeClass).toBeTruthy();
            }
        });
    }
});
