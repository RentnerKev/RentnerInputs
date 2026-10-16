import { expect, test } from '@playwright/test'

test('only subscribes to outside mousedown while a TimeInput dropdown is open', async ({
    page,
}) => {
    await page.addInitScript(() => {
        const active = new Set<EventListenerOrEventListenerObject>()
        let baseline = new Set<EventListenerOrEventListenerObject>()
        const add = document.addEventListener.bind(document)
        const remove = document.removeEventListener.bind(document)
        Object.assign(window, {
            captureTimeListenerBaseline: () => {
                baseline = new Set(active)
            },
            activeTimeListeners: () =>
                Array.from(active).filter((listener) => !baseline.has(listener))
                    .length,
        })
        document.addEventListener = (type, listener, options) => {
            if (type === 'mousedown') active.add(listener)
            add(type, listener, options)
        }
        document.removeEventListener = (type, listener, options) => {
            if (type === 'mousedown') active.delete(listener)
            remove(type, listener, options)
        }
    })
    await page.goto('/')
    const captureBaseline = () =>
        page.evaluate(() =>
            (
                window as unknown as { captureTimeListenerBaseline: () => void }
            ).captureTimeListenerBaseline(),
        )
    await expect(
        page.getByRole('button', { name: /^Uhrzeit Stunde auswählen/ }),
    ).toBeVisible()
    await captureBaseline()
    const count = () =>
        page.evaluate(() =>
            (
                window as unknown as { activeTimeListeners: () => number }
            ).activeTimeListeners(),
        )
    await expect.poll(count).toBe(0)
    await page
        .getByRole('button', { name: /^Uhrzeit Stunde auswählen/ })
        .click()
    await expect(page.getByRole('listbox')).toBeVisible()
    await expect.poll(count).toBe(1)
    await page.keyboard.press('Escape')
    await expect.poll(count).toBe(0)
    await page
        .getByRole('button', { name: /^Uhrzeit Minute auswählen/ })
        .click()
    await expect.poll(count).toBe(1)
    await page.locator('h1').click()
    await expect(page.getByRole('listbox')).toHaveCount(0)
    await expect.poll(count).toBe(0)
    await page.goto('/refs-test.html')
    await expect(
        page.getByRole('button', { name: 'Time Stunde auswählen' }),
    ).toBeVisible()
    await captureBaseline()
    await page.getByRole('button', { name: 'Time Stunde auswählen' }).click()
    await expect.poll(count).toBe(1)
    // Dispatch only click: a preceding mousedown would close the menu first.
    await page.getByTestId('unmount').dispatchEvent('click')
    await expect.poll(count).toBe(0)
})

test('loaded error tooltip retains the surrounding provider defaults', async ({
    page,
}) => {
    await page.goto('/refs-test.html')
    const icon = page
        .locator('#provider-error')
        .locator('..')
        .locator('svg[data-state]')
    await expect(icon).toBeVisible()
    await icon.hover()
    await expect(page.getByRole('tooltip')).toHaveText(
        'Provider tooltip error',
        { timeout: 1000 },
    )
})

test('failed tooltip chunk leaves errors, ARIA and the form usable', async ({
    page,
}) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(String(error)))
    let blocked = 0
    await page.route(/tooltips.*\.js/, (route) => {
        blocked++
        return route.abort()
    })
    await page.goto('/')
    const email = page.getByLabel('E-Mail-Adresse', { exact: true })
    await email.fill('broken')
    await email.blur()
    await expect(email).toHaveAttribute('aria-invalid', 'true')
    const errorId = await email.getAttribute('aria-errormessage')
    expect(errorId).toBeTruthy()
    await expect(page.locator(`[id="${errorId}"]`)).toContainText(
        'Ungültige E-Mail',
    )
    await expect.poll(() => blocked).toBeGreaterThan(0)
    await email.fill('working@example.com')
    await email.blur()
    await expect(email).not.toHaveAttribute('aria-invalid', 'true')
    expect(errors).toEqual([])
})
