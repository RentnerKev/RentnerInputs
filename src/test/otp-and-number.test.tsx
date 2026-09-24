import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { NumberInput } from '../Components/Inputs/NumberInput.js'
import { OtpInput } from '../Components/Inputs/OtpInput.js'
import { resolveNumberBound } from '../Hooks/Inputs/useNumberInput.logic.js'

describe('OTP and number fields', () => {
    test('labels each digit and submits the joined code', () => {
        const markup = renderToStaticMarkup(
            <OtpInput
                id="login-code"
                name="code"
                value={['1', '2', '', '', '', '']}
                onValueChange={() => undefined}
                label="Bestätigungscode"
                description="Sechs Ziffern"
                required
            />,
        )

        expect(markup).toContain('aria-label="Ziffer 1 von 6"')
        expect(markup).toContain('aria-label="Ziffer 6 von 6"')
        expect(markup).toContain('name="code" value="12"')
        expect(markup).toContain('aria-describedby="login-code-description"')
    })

    test('uses native number bounds first and legacy aliases as fallbacks', () => {
        expect(resolveNumberBound('5', 1)).toBe(5)
        expect(resolveNumberBound(undefined, 1)).toBe(1)
        expect(resolveNumberBound('', 1)).toBeUndefined()

        const markup = renderToStaticMarkup(
            <NumberInput
                value="3"
                onChange={() => undefined}
                min={5}
                max="10"
                minValue={1}
                maxValue={20}
            />,
        )
        expect(markup).toContain('min="5"')
        expect(markup).toContain('max="10"')
    })
})
