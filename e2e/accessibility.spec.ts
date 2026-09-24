import { AxeBuilder } from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('validates the form and exposes keyboard-accessible controls', async ({
    page,
}) => {
    await page.goto('/')
    await expect(
        page.getByRole('heading', { name: 'RentnerInputs Playground' }),
    ).toBeVisible()

    await page.getByRole('button', { name: 'Daten absenden' }).click()
    await expect(page.getByLabel('E-Mail-Adresse')).toHaveAttribute(
        'aria-invalid',
        'true',
    )
    await expect(page.locator('[aria-live="polite"]').first()).toBeVisible()

    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toEqual([])
})

test('supports keyboard password toggling and reduced motion', async ({
    page,
}) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    const password = page.getByRole('textbox', { name: 'Passwort' })
    await password.focus()
    await page.keyboard.press('Tab')
    const toggle = page.getByRole('button', { name: 'Passwort anzeigen' })
    await expect(toggle).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(
        page.getByRole('textbox', { name: 'Passwort' }),
    ).toHaveAttribute('type', 'text')
    await expect(page.locator('.glow-effect').first()).toHaveCSS(
        'animation-name',
        'none',
    )
})

test('keeps text clear of leading icons in inputs and textareas', async ({
    page,
}) => {
    await page.goto('/')

    for (const [label, minimum] of [
        ['Text', 44],
        ['Nachricht', 44],
        ['Telefonnummer', 16],
    ] as const) {
        const field = page.getByLabel(label, { exact: true })
        const paddingLeft = await field.evaluate((element) =>
            Number.parseFloat(getComputedStyle(element).paddingLeft),
        )
        expect(paddingLeft).toBeGreaterThanOrEqual(minimum)
    }
})

test('supports OTP typing, paste, correction, and number bounds', async ({
    page,
}) => {
    await page.goto('/')
    const firstDigit = page.getByRole('textbox', { name: 'Ziffer 1 von 6' })
    await firstDigit.fill('1')
    await expect(
        page.getByRole('textbox', { name: 'Ziffer 2 von 6' }),
    ).toBeFocused()
    await page.keyboard.type('2')
    await expect(
        page.getByRole('textbox', { name: 'Ziffer 3 von 6' }),
    ).toBeFocused()
    await page.getByRole('textbox', { name: 'Ziffer 3 von 6' }).fill('3')
    await page.getByRole('textbox', { name: 'Ziffer 4 von 6' }).fill('4')
    await page.getByRole('textbox', { name: 'Ziffer 5 von 6' }).fill('5')
    await page.getByRole('textbox', { name: 'Ziffer 6 von 6' }).fill('6')
    await expect(page.locator('input[name="otp"]')).toHaveValue('123456')

    await page.getByRole('textbox', { name: 'Ziffer 3 von 6' }).fill('')
    await expect(page.locator('input[name="otp"]')).toHaveValue('12456')
    await page.getByRole('textbox', { name: 'Ziffer 3 von 6' }).fill('9')
    await expect(page.locator('input[name="otp"]')).toHaveValue('129456')

    await firstDigit.evaluate((element: HTMLInputElement) => {
        element.focus()
        const clipboardData = new DataTransfer()
        clipboardData.setData('text', '84 27 19')
        element.dispatchEvent(
            new ClipboardEvent('paste', { bubbles: true, clipboardData }),
        )
    })
    await expect(page.locator('input[name="otp"]')).toHaveValue('842719')

    const numberInput = page.getByRole('spinbutton', {
        name: 'Begrenzter Betrag',
    })
    await expect(numberInput).toHaveAttribute('min', '5')
    await expect(numberInput).toHaveAttribute('max', '50')
    await numberInput.fill('4')
    await expect(numberInput).toHaveAttribute('aria-invalid', 'true')
    await numberInput.fill('5')
    await expect(numberInput).not.toHaveAttribute('aria-invalid', 'true')
    await numberInput.fill('51')
    await expect(numberInput).toHaveValue('5')
})

test('animates OTP verification feedback and announces both outcomes', async ({
    page,
}) => {
    await page.goto('/')
    const firstDigit = page.getByRole('textbox', { name: 'Ziffer 1 von 6' })
    await firstDigit.fill('123456')
    const group = page.getByRole('group', { name: 'Bestätigungscode' })
    await expect(group).toHaveAttribute('data-otp-status', 'idle')
    await expect(page.locator('[data-otp-progress] > span')).toHaveCount(6)

    await page.getByRole('button', { name: 'Falsch' }).click()
    await expect(group).toHaveAttribute('data-otp-status', 'error')
    await expect(group).toHaveAttribute('aria-invalid', 'true')
    await expect(
        page.getByText('Der Bestätigungscode ist falsch'),
    ).toBeVisible()
    await expect(group).toHaveCSS('animation-name', 'otp-shake')

    await page.getByRole('button', { name: 'Bestätigt' }).click()
    await expect(group).toHaveAttribute('data-otp-status', 'success')
    await expect(page.getByRole('status')).toContainText('Code bestätigt')
    await expect(firstDigit).toHaveCSS('animation-name', 'otp-confirm')

    await firstDigit.fill('9')
    await expect(group).toHaveAttribute('data-otp-status', 'idle')
})

test('removes OTP motion when reduced motion is requested', async ({
    page,
}) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.getByRole('button', { name: 'Falsch' }).click()

    const group = page.getByRole('group', { name: 'Bestätigungscode' })
    await expect(group).toHaveAttribute('data-otp-status', 'error')
    await expect(group).toHaveCSS('animation-name', 'none')
})
