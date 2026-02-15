import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';

test.beforeAll(async () => {
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
        await page.getByPlaceholder('Username').fill('smoke_teacher');
        await page.getByPlaceholder('Password').fill('SmokePass123!');
        await page.getByRole('button', { name: 'Sign in', exact: true }).click();
        await expect(page).toHaveURL('/');

        // Create Session
        await page.goto('/interact');
        await page.getByRole('button', { name: '创建课堂' }).click();
        await page.getByPlaceholder('请输入课程主题').fill('Auth Test Session');
        await page.getByRole('button', { name: '确认创建' }).click();

        // Verify Session Created and Redirected
        await expect(page).toHaveURL(/\/interact\/\d+/);

        // Start Class
        await page.getByRole('button', { name: '开始课堂' }).click();
        await expect(page.getByRole('button', { name: '结束课堂' })).toBeVisible();
    });

    test('Student can login', async ({ page }) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username').fill('smoke_student');
        await page.getByPlaceholder('Password').fill('SmokePass123!');
        await page.getByRole('button', { name: 'Sign in', exact: true }).click();
        await expect(page).toHaveURL('/');
    });
});
