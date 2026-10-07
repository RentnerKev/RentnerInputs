import { expect, test } from '@playwright/test'

test('uses a red ring when the required time is missing', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Daten absenden' }).click()

    const field = page.getByRole('group', { name: 'Uhrzeit' })
    await expect(field).toHaveClass(/ring-red-500\/50/)

    const ringColor = await field.evaluate((element) =>
        getComputedStyle(element).getPropertyValue('--tw-ring-color'),
    )
    expect(ringColor).not.toBe('')
})
