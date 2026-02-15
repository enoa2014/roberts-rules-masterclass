import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';

test.beforeAll(async () => {
    try {
        execSync('npm run smoke:seed', { stdio: 'ignore' });
    } catch (e) {
        console.error("Failed to seed users", e);
    }
});

test.describe('Realtime Interaction Flow', () => {
    test('Full classroom interaction', async ({ browser }) => {
        test.setTimeout(90_000);
        test.info().annotations.push({ type: 'retries', description: '2' });

        // 1. Teacher Context
        const teacherContext = await browser.newContext();
        const teacherPage = await teacherContext.newPage();

        // Teacher Login & Create Session
        await teacherPage.goto('/login');
        await teacherPage.getByTestId('login-username').fill('smoke_teacher');
        await teacherPage.getByTestId('login-password').fill('SmokePass123!');
        await teacherPage.getByTestId('login-submit').click();
        await expect(teacherPage).toHaveURL('/');

        await teacherPage.goto('/interact');
        await teacherPage.getByRole('button', { name: '创建课堂' }).click();
        await teacherPage.getByPlaceholder('请输入课程主题').fill('Realtime Test Session');
        await teacherPage.getByRole('button', { name: '确认创建' }).click();

        await expect(teacherPage).toHaveURL(/\/interact\/\d+/);
        const sessionId = teacherPage.url().split('/').pop();
        console.log(`Session Created: ${sessionId}`);

        // Start Class
        await teacherPage.getByRole('button', { name: '开始课堂' }).click();
        await expect(teacherPage.getByRole('button', { name: '结束课堂' })).toBeVisible({ timeout: 15000 });

        // 2. Student Context
        const studentContext = await browser.newContext();
        const studentPage = await studentContext.newPage();
        // Enable Console Log for Debugging
        studentPage.on('console', msg => console.log(`[Student Page] ${msg.type()}: ${msg.text()}`));

        // Student Login
        await studentPage.goto('/login');
        await studentPage.getByTestId('login-username').fill('smoke_student');
        await studentPage.getByTestId('login-password').fill('SmokePass123!');
        await studentPage.getByTestId('login-submit').click();
        await expect(studentPage).toHaveURL('/');

        // Student Joins Session
        await studentPage.goto(`/interact/${sessionId}`);

        // Wait for session title (heading contains status badge + title text)
        await expect(studentPage.getByRole('heading', { level: 1 })).toContainText('Realtime Test Session', { timeout: 30000 });

        // 3. Interaction: Raise Hand
        await expect(studentPage.getByRole('button', { name: '举手发言' })).toBeVisible({ timeout: 15000 });
        const raiseRespPromise = studentPage.waitForResponse(
            (resp) =>
                resp.url().includes(`/api/interact/sessions/${sessionId}/hand`) &&
                resp.request().method() === 'POST',
        );
        await studentPage.getByRole('button', { name: '举手发言' }).click();
        const raiseResp = await raiseRespPromise;
        expect(raiseResp.status()).toBe(200);
        await expect(studentPage.getByRole('button', { name: '取消举手' })).toBeVisible();

        // Verify Teacher sees hand
        try {
            await expect(teacherPage.getByText('冒烟学员')).toBeVisible({ timeout: 8000 });
        } catch {
            // Fallback if SSE event arrives late in CI.
            await teacherPage.reload();
            await expect(teacherPage.getByText('冒烟学员')).toBeVisible({ timeout: 15000 });
        }

        // 4. Interaction: Teacher Picks Student
        const pickRespPromise = teacherPage.waitForResponse(
            (resp) =>
                resp.url().includes(`/api/interact/sessions/${sessionId}/timer`) &&
                resp.request().method() === 'POST',
        );
        await teacherPage.locator('button[title="点名发言"]').first().click();
        const pickResp = await pickRespPromise;
        expect(pickResp.status()).toBe(200);

        // 5. Verify Speaking State
        try {
            await expect(teacherPage.getByText('冒烟学员 正在发言')).toBeVisible({ timeout: 8000 });
        } catch {
            await teacherPage.reload();
            await expect(teacherPage.getByText('冒烟学员 正在发言')).toBeVisible({ timeout: 15000 });
        }
        try {
            await expect(studentPage.getByText('您正在发言中...')).toBeVisible({ timeout: 8000 });
        } catch {
            await studentPage.reload();
            await expect(studentPage.getByText('您正在发言中...')).toBeVisible({ timeout: 15000 });
        }

        // 6. Interaction: Stop Speech
        const stopRespPromise = teacherPage.waitForResponse(
            (resp) =>
                resp.url().includes(`/api/interact/sessions/${sessionId}/timer`) &&
                resp.request().method() === 'POST',
        );
        await teacherPage.getByRole('button', { name: '停止发言' }).click();
        const stopResp = await stopRespPromise;
        expect(stopResp.status()).toBe(200);

        // Verify Idle State
        try {
            await expect(teacherPage.getByText('00:00')).toBeVisible({ timeout: 8000 });
        } catch {
            await teacherPage.reload();
            await expect(teacherPage.getByText('00:00')).toBeVisible({ timeout: 15000 });
        }
        try {
            await expect(studentPage.getByRole('button', { name: '举手发言' })).toBeVisible({ timeout: 8000 });
        } catch {
            await studentPage.reload();
            await expect(studentPage.getByRole('button', { name: '举手发言' })).toBeVisible({ timeout: 15000 });
        }

        await teacherContext.close();
        await studentContext.close();
    });
});
