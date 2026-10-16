import { expect, test } from '@playwright/test'
test('keeps numeric intermediate drafts and commits nullable decimal values', async ({
    page,
}) => {
    await page.goto('/')
    const input = page.getByLabel('Numerischer Wert')
    const value = page.getByTestId('numeric-value')
    await expect(value).toHaveText('null')
    await input.fill('-')
    await expect(input).toHaveValue('-')
    await expect(value).toHaveText('null')
    await input.fill('-.')
    await expect(input).toHaveValue('-.')
    await input.fill('-1.')
    await expect(input).toHaveValue('-1.')
    await expect(value).toHaveText('null')
    expect(
        await input.evaluate((element) =>
            new FormData((element as HTMLInputElement).form!).get(
                'numericValue',
            ),
        ),
    ).toBe('')
    await input.fill('-1.25')
    await input.press('Tab')
    await expect(value).toHaveText('-1.25')
    expect(
        await input.evaluate((element) =>
            new FormData((element as HTMLInputElement).form!).get(
                'numericValue',
            ),
        ),
    ).toBe('-1.25')
    await input.fill('')
    await input.press('Tab')
    await expect(value).toHaveText('null')
    await input.fill('0')
    await input.press('Enter')
    await expect(value).toHaveText('0')
    await input.fill('-')
    await input.press('Tab')
    await expect(input).toHaveValue('0')
    await expect(input).toHaveCSS('height', '44px')
})
test('time portal keeps focus, selection and Escape restoration', async ({
    page,
}) => {
    await page.goto('/')
    const hour = page.getByRole('button', {
        name: /^Uhrzeit Stunde auswählen/,
    })
    await hour.click()
    const option = page.getByRole('option', { name: '09', exact: true })
    await expect(option).toBeVisible()
    await option.click()
    await expect(hour).toBeFocused()
    await hour.click()
    await page.keyboard.press('Escape')
    await expect(hour).toBeFocused()
    await expect(page.getByRole('listbox')).toHaveCount(0)
})

test('uses provider portal defaults and keeps logical Tab order', async ({
    page,
}) => {
    await page.goto('/?custom-portal')
    const hour = page.getByRole('button', { name: /^Uhrzeit Stunde auswählen/ })
    const minute = page.getByRole('button', {
        name: /^Uhrzeit Minute auswählen/,
    })
    await hour.click()
    const popup = page.locator('#root > .time-popup-custom')
    await expect(popup).toBeVisible()
    await expect(popup).toHaveCSS('z-index', '12345')
    await page.keyboard.press('Tab')
    await expect(minute).toBeFocused()
    await expect(page.getByRole('listbox')).toHaveCount(0)
    await minute.click()
    await expect(popup).toBeVisible()
    await expect(popup).toHaveCSS('z-index', '12345')
    await expect(
        popup.getByRole('listbox', { name: 'Minute auswählen' }),
    ).toBeVisible()
    await page.keyboard.press('Shift+Tab')
    await expect(minute).toBeFocused()
    await expect(page.getByRole('listbox')).toHaveCount(0)
    await expect(page.getByTestId('time-blurs')).toHaveText('0')
    await page.getByLabel('Numerischer Wert').click()
    await expect(page.getByTestId('time-blurs')).toHaveText('1')
})

test('lets native Tab skip inert controls after a minute popup', async ({
    page,
}) => {
    await page.goto('/')
    const minute = page.getByRole('button', {
        name: /^Uhrzeit Minute auswählen/,
    })
    await minute.evaluate((button) => {
        const group = button.closest('[role="group"]')!
        const inert = document.createElement('div')
        inert.inert = true
        inert.innerHTML = '<button id="ignored">Ignored</button>'
        const after = document.createElement('button')
        after.id = 'after-time'
        after.textContent = 'After time'
        group.parentElement!.after(inert, after)
    })
    await minute.click()
    await page.keyboard.press('Tab')
    await expect(page.locator('#after-time')).toBeFocused()
    await expect(page.getByTestId('time-blurs')).toHaveText('1')
})

test('keeps a minute popup inside a ShadowRoot within the field boundary', async ({
    page,
}) => {
    await page.goto('/?shadow-portal')
    const minute = page.getByRole('button', {
        name: /^Uhrzeit Minute auswählen/,
    })
    await minute.click()
    await expect(
        page.getByTestId('time-shadow-host').getByRole('listbox'),
    ).toBeVisible()
    await expect(page.getByTestId('time-blurs')).toHaveText('0')
    await page.getByLabel('Numerischer Wert').click()
    await expect(page.getByTestId('time-blurs')).toHaveText('1')
})
