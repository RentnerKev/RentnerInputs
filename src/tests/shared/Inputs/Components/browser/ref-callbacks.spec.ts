import { expect, test } from '@playwright/test'

test('preserves callback refs through input updates and cleans up each ref once', async ({
    page,
}) => {
    await page.goto('/refs-test.html')

    const events = () => page.evaluate(() => window.refTestEvents)
    const count = async (event: string) =>
        (await events()).filter((item) => item === event).length

    await expect(page.getByLabel('Text', { exact: true })).toBeVisible()
    await expect(
        page.getByRole('button', { name: 'Time Stunde auswählen' }),
    ).toBeVisible()
    await expect(
        page.getByRole('textbox', { name: 'Ziffer 1 von 6' }),
    ).toBeVisible()

    await expect.poll(() => count('text-public:attach')).toBe(1)
    await expect.poll(() => count('text-trigger:attach')).toBe(1)
    await expect.poll(() => count('time-hidden:attach')).toBe(1)
    await expect.poll(() => count('time-hour-trigger:attach')).toBe(1)
    await expect.poll(() => count('otp-first:attach')).toBe(1)

    await page.getByLabel('Text', { exact: true }).fill('Kevin')
    await page.getByTestId('rerender').click()
    await page.getByRole('textbox', { name: 'Ziffer 1 von 6' }).fill('7')
    await page.getByTestId('change-otp-length').click()

    await expect(
        page.getByRole('textbox', { name: 'Ziffer 1 von 4' }),
    ).toHaveValue('7')
    expect(await events()).not.toContain('text-public:cleanup')
    expect(await events()).not.toContain('text-trigger:null')
    expect(await events()).not.toContain('time-hidden:cleanup')
    expect(await events()).not.toContain('time-hour-trigger:null')
    expect(await events()).not.toContain('otp-first:cleanup')
    expect(await count('otp-first:attach')).toBe(1)

    await page.getByTestId('change-otp-ref').click()
    await expect.poll(() => count('otp-first:cleanup')).toBe(1)
    await expect.poll(() => count('otp-second:attach')).toBe(1)
    await page.getByRole('textbox', { name: 'Ziffer 1 von 4' }).fill('8')
    await page.getByTestId('rerender').click()
    expect(await count('otp-second:attach')).toBe(1)
    expect(await count('otp-second:cleanup')).toBe(0)

    await page.getByTestId('unmount').click()

    await expect
        .poll(() =>
            page.evaluate(() =>
                Object.values(window.refTestNodes).every(
                    (node) => node === null,
                ),
            ),
        )
        .toBe(true)
    expect(await count('text-public:cleanup')).toBe(1)
    expect(await count('text-trigger:null')).toBe(1)
    expect(await count('time-hidden:cleanup')).toBe(1)
    expect(await count('time-hour-trigger:null')).toBe(1)
    expect(await count('otp-second:cleanup')).toBe(1)
})
