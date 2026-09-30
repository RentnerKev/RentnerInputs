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

    const iconFieldChecks = [
        ['Text', 44],
        ['Nachricht', 44],
        ['Telefonnummer', 16],
    ] as const
    const paddings = await Promise.all(
        iconFieldChecks.map(([label]) =>
            page
                .getByLabel(label, { exact: true })
                .evaluate((element) =>
                    Number.parseFloat(getComputedStyle(element).paddingLeft),
                ),
        ),
    )

    iconFieldChecks.forEach(([, minimum], index) => {
        expect(paddings[index]).toBeGreaterThanOrEqual(minimum)
    })
})

test('supports direct value callbacks through CustomInput', async ({
    page,
}) => {
    await page.goto('/')

    const text = page.getByLabel('Text', { exact: true })
    const textarea = page.getByLabel('Nachricht', { exact: true })
    await text.fill('Kev')
    await textarea.fill('Eine Nachricht')

    await page.getByRole('button', { name: 'Falsch' }).click()

    await expect(text).toHaveValue('Kev')
    await expect(textarea).toHaveValue('Eine Nachricht')
})

test('supports direct value callbacks across specialized string fields', async ({
    page,
}) => {
    await page.goto('/')

    await page
        .getByLabel('E-Mail-Adresse', { exact: true })
        .fill('kev@example.com')
    await page.getByLabel('Passwort', { exact: true }).fill('sicheres-passwort')
    await page.getByLabel('Telefonnummer', { exact: true }).fill('+49123456789')
    await page.getByLabel('Betrag', { exact: true }).fill('12')
    await page.getByLabel('Geldbetrag', { exact: true }).fill('1234.56')

    await expect(
        page.getByLabel('E-Mail-Adresse', { exact: true }),
    ).toHaveValue('kev@example.com')
    await expect(page.getByLabel('Passwort', { exact: true })).toHaveValue(
        'sicheres-passwort',
    )
    await expect(page.getByLabel('Telefonnummer', { exact: true })).toHaveValue(
        '+49123456789',
    )
    await expect(page.getByLabel('Betrag', { exact: true })).toHaveValue('12')
    await expect(page.getByLabel('Geldbetrag', { exact: true })).toHaveValue(
        '1234.56',
    )

    await page.getByRole('button', { name: 'Uhrzeit' }).first().click()
    await page.getByRole('option', { name: '09', exact: true }).click()
    await page.getByRole('button', { name: 'Uhrzeit' }).nth(1).click()
    await page.getByRole('option', { name: '30', exact: true }).click()

    await expect(page.locator('input[type="time"]')).toHaveValue('09:30')
    await expect(page.getByRole('group', { name: 'Uhrzeit' })).toContainText(
        '09',
    )
    await expect(page.getByRole('group', { name: 'Uhrzeit' })).toContainText(
        '30',
    )
})

test('supports distinct time controls and listbox keyboard navigation', async ({
    page,
}) => {
    await page.goto('/')

    const hourTrigger = page.getByRole('button', {
        name: 'Uhrzeit Stunde auswählen',
    })
    const minuteTrigger = page.getByRole('button', {
        name: 'Uhrzeit Minute auswählen',
    })
    await expect(hourTrigger).toHaveCount(1)
    await expect(minuteTrigger).toHaveCount(1)

    await hourTrigger.focus()
    await page.keyboard.press('ArrowDown')
    const hourOptions = page.getByRole('option')
    await expect(hourOptions.first()).toBeFocused()
    await page.keyboard.press('ArrowDown')
    await expect(
        page.getByRole('option', { name: '01', exact: true }),
    ).toBeFocused()
    await page.keyboard.press('ArrowUp')
    await expect(
        page.getByRole('option', { name: '00', exact: true }),
    ).toBeFocused()
    await page.keyboard.press('End')
    await expect(
        page.getByRole('option', { name: '23', exact: true }),
    ).toBeFocused()
    await page.keyboard.press('Home')
    await expect(
        page.getByRole('option', { name: '00', exact: true }),
    ).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.locator('input[type="time"]')).toHaveValue('00:00')
    await expect(hourTrigger).toBeFocused()

    await minuteTrigger.focus()
    await page.keyboard.press('Enter')
    await expect(
        page.getByRole('option', { name: '00', exact: true }),
    ).toBeFocused()
    await page.keyboard.press('ArrowDown')
    await expect(
        page.getByRole('option', { name: '05', exact: true }),
    ).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.locator('input[type="time"]')).toHaveValue('00:05')
    await expect(minuteTrigger).toBeFocused()

    await minuteTrigger.click()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('listbox')).toHaveCount(0)
    await expect(minuteTrigger).toBeFocused()

    await hourTrigger.click()
    await expect(page.getByRole('listbox')).toBeVisible()
    await page.keyboard.press('Tab')
    await expect(page.getByRole('listbox')).toHaveCount(0)
    await expect(minuteTrigger).toBeFocused()

    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toEqual([])
})

test('clears a native validation message when a constraint changes', async ({
    page,
}) => {
    await page.goto('/')

    const amount = page.getByRole('spinbutton', {
        name: 'Betrag',
        exact: true,
    })
    await amount.evaluate((input: HTMLInputElement) => {
        input.min = '0'
        input.step = '2'
    })
    await amount.fill('3')
    expect(
        await amount.evaluate(
            (input: HTMLInputElement) => input.validity.stepMismatch,
        ),
    ).toBe(true)
    expect(
        await amount.evaluate((input: HTMLInputElement) =>
            input.checkValidity(),
        ),
    ).toBe(false)
    await expect(amount).toHaveAttribute('aria-invalid', 'true')

    await amount.evaluate((input: HTMLInputElement) => {
        input.step = '1'
    })
    await page.getByLabel('Text', { exact: true }).fill('Kevin')
    await expect(amount).not.toHaveAttribute('aria-invalid', 'true')
    await expect
        .poll(() =>
            amount.evaluate((input: HTMLInputElement) => input.checkValidity()),
        )
        .toBe(true)
})

test('preserves money precision in the display and native form value', async ({
    page,
}) => {
    await page.goto('/')

    const money = page.getByLabel('Geldbetrag', { exact: true })
    await money.fill('1.239')
    await expect(money).toHaveValue('1.239')

    await page.getByRole('button', { name: 'Uhrzeit Stunde auswählen' }).focus()
    await expect(money).toHaveValue('$1.239')

    const formValue = await money.evaluate((input: HTMLInputElement) =>
        new FormData(input.form ?? undefined).get('money'),
    )
    expect(formValue).toBe('1.239')
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
        const paste = new ClipboardEvent('paste', {
            bubbles: true,
            cancelable: true,
            clipboardData,
        })
        // Firefox does not retain constructor-provided clipboard data.
        Object.defineProperty(paste, 'clipboardData', { value: clipboardData })
        element.dispatchEvent(paste)
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
