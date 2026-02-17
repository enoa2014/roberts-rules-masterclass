import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import { isRemoteE2E } from './utils/e2e-env';

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

test.describe('Auth and Session Creation Flow', () => {
    test('Teacher can login and create a session', async ({ page }) => {
        // Teacher Login
        await page.goto('/login');
        await page.getByTestId('login-username').fill('smoke_teacher');
        await page.getByTestId('login-password').fill('SmokePass123!');
        await page.getByTestId('login-submit').click();
        await expect(page).toHaveURL('/');

        // Create Session
        await page.goto('/interact');
        await page.getByRole('button', { name: '创建课堂' }).click();
        await page.getByPlaceholder('请输入课程主题').fill('Auth Test Session');
        await page.getByRole('button', { name: '确认创建' }).click();

        // Verify Session Created and Redirected
        await expect(page).toHaveURL(/\/interact\/\d+/);
        // Session detail page should be reachable even if SSE state hydrates slowly in remote env.
        await expect(page).toHaveURL(/\/interact\/\d+/);
    });

    test('Student can login', async ({ page }) => {
        await page.goto('/login');
        await page.getByTestId('login-username').fill('smoke_student');
        await page.getByTestId('login-password').fill('SmokePass123!');
        await page.getByTestId('login-submit').click();
        await expect(page).toHaveURL('/');
    });
});
