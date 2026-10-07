export async function check({ page, expect }) {
    await expect(
        page.getByLabel('External error', { exact: true }),
    ).toHaveAttribute('aria-describedby', 'external-error-error')
    await expect(page.locator('#external-error-error')).toHaveText(
        'External error immediately',
    )
    const form = page.locator('#consumer-form')
    const formValue = (name) =>
        form.evaluate(
            (element, fieldName) => new FormData(element).get(fieldName),
            name,
        )

    await expect(page.getByLabel('Quantity')).toHaveValue('5kg')
    expect(await formValue('quantity')).toBe('5')
    await expect(page.getByLabel('Money')).toHaveValue('$1.239')
    expect(await formValue('money')).toBe('1.239')
    const fieldStyle = await page.getByLabel('Money').evaluate((input) => {
        const style = getComputedStyle(input)
        return {
            background: style.backgroundColor,
            borderWidth: Number.parseFloat(style.borderTopWidth),
        }
    })
    expect(fieldStyle.background).toBe('rgb(34, 37, 43)')
    expect(fieldStyle.borderWidth).toBeGreaterThan(0)

    const required = page.getByLabel('Required value')
    expect(await form.evaluate((element) => element.checkValidity())).toBe(
        false,
    )
    await expect(required).toHaveAttribute('aria-invalid', 'true')
    await page
        .getByRole('button', { name: 'Set required value externally' })
        .click()
    await expect(required).toHaveValue('set by parent')
    await expect
        .poll(() =>
            form.evaluate((element) =>
                Array.from(element.elements)
                    .filter(
                        (control) =>
                            'validity' in control && !control.validity.valid,
                    )
                    .map((control) => ({
                        id: control.id ?? '',
                        name: 'name' in control ? control.name : '',
                        type: 'type' in control ? control.type : '',
                        value: 'value' in control ? control.value : '',
                        validationMessage: control.validationMessage ?? '',
                    })),
            ),
        )
        .toEqual([])

    const filteredForm = page.locator('#filtered-form')
    const filtered = page.getByRole('textbox', {
        name: 'Filtered value',
        exact: true,
    })
    expect(
        await filteredForm.evaluate((element) => element.checkValidity()),
    ).toBe(false)
    await expect(filtered).toHaveAttribute('aria-invalid', 'true')
    await filtered.fill('9')
    await expect(filtered).toHaveValue('3')
    expect(await filtered.evaluate((input) => input.checkValidity())).toBe(
        false,
    )
    await page
        .getByRole('button', {
            name: 'Set filtered value externally',
            exact: true,
        })
        .click()
    await expect(filtered).toHaveValue('1')
    await expect
        .poll(() => filteredForm.evaluate((element) => element.checkValidity()))
        .toBe(true)
    await expect(filtered).not.toHaveAttribute('aria-invalid', 'true')

    await page
        .getByRole('button', { name: 'Reset filtered value externally' })
        .click()
    await expect(filtered).toHaveValue('3')
    expect(await filtered.evaluate((input) => input.checkValidity())).toBe(
        false,
    )
    await expect(filtered).toHaveAttribute('aria-invalid', 'true')

    await page
        .getByRole('button', {
            name: 'Set filtered value to another invalid value',
        })
        .click()
    await expect(filtered).toHaveValue('4')
    await expect(filtered).toHaveAttribute('aria-invalid', 'true')
    expect(
        await filtered.evaluate((input) => input.validity.patternMismatch),
    ).toBe(true)

    await page
        .getByRole('button', {
            name: 'Set filtered value externally',
            exact: true,
        })
        .click()
    await expect(filtered).toHaveValue('1')
    await expect(filtered).not.toHaveAttribute('aria-invalid', 'true')
    expect(await filtered.evaluate((input) => input.validity.valid)).toBe(true)

    const time = page.locator('#appointment-input')
    await expect(time).toHaveAttribute('min', '09:10')
    await expect(time).toHaveAttribute('max', '09:40')
    await expect(time).toHaveAttribute('step', '900')
    const nativeConstraints = await time.evaluate((input) => {
        const probe = document.createElement('input')
        probe.type = 'time'
        probe.min = input.min
        probe.max = input.max
        probe.step = input.step
        const supportsNativeTime = probe.type === 'time'
        probe.value = '09:05'
        const underflow = probe.validity.rangeUnderflow
        probe.value = '09:20'
        const stepMismatch = probe.validity.stepMismatch
        probe.value = '09:45'
        const overflow = probe.validity.rangeOverflow
        return { supportsNativeTime, underflow, stepMismatch, overflow }
    })
    if (nativeConstraints.supportsNativeTime) {
        expect({
            underflow: nativeConstraints.underflow,
            stepMismatch: nativeConstraints.stepMismatch,
            overflow: nativeConstraints.overflow,
        }).toEqual({
            underflow: true,
            stepMismatch: true,
            overflow: true,
        })
    } else {
        expect(await time.evaluate((input) => input.type)).toBe('text')
        await page
            .getByRole('button', { name: 'Set appointment to invalid time' })
            .click()
        await expect(time).toHaveValue('09:20')
        await expect
            .poll(() => form.evaluate((element) => element.checkValidity()))
            .toBe(false)
        expect(await time.evaluate((input) => input.validity.customError)).toBe(
            true,
        )

        await page
            .getByRole('button', { name: 'Set appointment to valid time' })
            .click()
        await expect(time).toHaveValue('09:10')
        await expect
            .poll(() => form.evaluate((element) => element.checkValidity()))
            .toBe(true)
        expect(await time.evaluate((input) => input.validity.customError)).toBe(
            false,
        )
    }

    const hourTrigger = page.getByRole('button', {
        name: 'Appointment time Stunde auswählen',
    })
    const minuteTrigger = page.getByRole('button', {
        name: 'Appointment time Minute auswählen',
    })
    await hourTrigger.click()
    await expect(page.getByRole('listbox')).toBeVisible()
    await page.keyboard.press('Tab')
    await expect(page.getByRole('listbox')).toHaveCount(0)
    await expect(minuteTrigger).toBeFocused()

    await page.keyboard.press('Enter')
    await expect(page.getByRole('option')).toHaveText(['10', '25', '40'])
    await expect(
        page.getByRole('option', { name: '10', exact: true }),
    ).toBeFocused()
    await page.keyboard.press('ArrowDown')
    await expect(
        page.getByRole('option', { name: '25', exact: true }),
    ).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(time).toHaveValue('09:25')
    const finalTimeValidity = await time.evaluate((input) => ({
        type: input.type,
        valid: input.validity.valid,
        customError: input.validity.customError,
        stepMismatch: input.validity.stepMismatch,
        rangeUnderflow: input.validity.rangeUnderflow,
        rangeOverflow: input.validity.rangeOverflow,
    }))
    if (nativeConstraints.supportsNativeTime) {
        expect(finalTimeValidity).toEqual({
            type: 'time',
            valid: true,
            customError: false,
            stepMismatch: false,
            rangeUnderflow: false,
            rangeOverflow: false,
        })
    } else {
        expect(finalTimeValidity).toEqual({
            type: 'text',
            valid: true,
            customError: false,
            stepMismatch: false,
            rangeUnderflow: false,
            rangeOverflow: false,
        })
    }
}
