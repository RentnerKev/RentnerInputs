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
