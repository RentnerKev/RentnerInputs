import { expect, test } from '@playwright/test'

test('quantity applies native bounds before aliases, preserves text editing, suffix and raw form values', async ({
    page,
}) => {
    await page.goto('/')
    const input = page.getByRole('textbox', {
        name: 'Quantity with native bounds',
        exact: true,
    })
    await expect(input).toHaveAttribute('type', 'text')
    await expect(input).toHaveAttribute('inputmode', 'numeric')
    await expect(input).toHaveValue('5kg')
    await input.focus()
    await expect(input).toHaveValue('5')
    await input.fill('4')
    await input.press('Tab')
    await expect(input).toHaveValue('4kg')
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(
        page.getByText('The value must be at least 5', { exact: true }),
    ).toBeVisible()
    expect(
        await input.evaluate(
            (element) => (element as HTMLInputElement).validity.rangeUnderflow,
        ),
    ).toBe(false)
    expect(
        await input.evaluate(
            (element) => (element as HTMLInputElement).validity.customError,
        ),
    ).toBe(true)
    await input.focus()
    await input.fill('11')
    await expect(input).toHaveValue('4')
    await input.fill('10')
    await input.press('Tab')
    await expect(input).toHaveValue('10kg')
    await expect(input).not.toHaveAttribute('aria-invalid', 'true')
    expect(
        await input.evaluate((element) =>
            new FormData((element as HTMLInputElement).form!).get('quantity'),
        ),
    ).toBe('10')
    await input.focus()
    await input.fill('')
    await input.press('Tab')
    await expect(input).toHaveValue('')
    expect(
        await input.evaluate((element) =>
            (element as HTMLInputElement).checkValidity(),
        ),
    ).toBe(true)
})

for (const [invalid, valid] of [
    ['++49 30 123456', '+49 (0) 30 123456'],
    ['+49 (30 123456', '+1 (212) 555-0100'],
    ['+49 30) 123456', '0049 30/123456'],
]) {
    test(`phone rejects ${invalid} and accepts ${valid} and optional clearing`, async ({
        page,
    }) => {
        await page.goto('/')
        const phone = page.getByRole('textbox', { name: /^Telefonnummer/ })
        await phone.fill(invalid)
        await phone.press('Tab')
        await expect(phone).toHaveAttribute('aria-invalid', 'true')
        expect(
            await phone.evaluate(
                (element) => (element as HTMLInputElement).validity.customError,
            ),
        ).toBe(true)
        await phone.fill(valid)
        await phone.press('Tab')
        await expect(phone).not.toHaveAttribute('aria-invalid', 'true')
        expect(
            await phone.evaluate((element) =>
                (element as HTMLInputElement).checkValidity(),
            ),
        ).toBe(true)
        await phone.fill('')
        await phone.press('Tab')
        await expect(phone).not.toHaveAttribute('aria-invalid', 'true')
        expect(
            await phone.evaluate((element) =>
                (element as HTMLInputElement).checkValidity(),
            ),
        ).toBe(true)
    })
}
