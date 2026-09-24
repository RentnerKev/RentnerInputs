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

    test('shows explicit verification feedback without assuming a full code is valid', () => {
        const baseProps = {
            id: 'login-code',
            value: ['1', '2', '3', '4', '5', '6'],
            onValueChange: () => undefined,
        }
        const idle = renderToStaticMarkup(<OtpInput {...baseProps} />)
        const error = renderToStaticMarkup(
            <OtpInput {...baseProps} status="error" />,
        )
        const success = renderToStaticMarkup(
            <OtpInput {...baseProps} status="success" />,
        )

        expect(idle).toContain('data-otp-status="idle"')
        expect(idle).not.toContain('Code bestätigt')
        expect(error).toContain('data-otp-status="error"')
        expect(error).toContain('aria-invalid="true"')
        expect(error).toContain('Der Bestätigungscode ist falsch')
        expect(error).toContain('motion-safe:animate-otp-shake')
        expect(success).toContain('data-otp-status="success"')
        expect(success).toContain('role="status"')
        expect(success).toContain('Code bestätigt')
        expect(success).toContain('motion-safe:animate-otp-confirm')
    })

    test('allows colors and motion to be customized or disabled', () => {
        const markup = renderToStaticMarkup(
            <OtpInput
                value={['1', '', '', '']}
                length={4}
                onValueChange={() => undefined}
                status="error"
                animated={false}
                showProgress={false}
                feedbackClassNames={{ error: 'border-orange-500' }}
                messages={{ otpInvalid: 'Falscher Code' }}
            />,
        )

        expect(markup).toContain('border-orange-500')
        expect(markup).toContain('Falscher Code')
        expect(markup).not.toContain('data-otp-progress')
        expect(markup).not.toContain('motion-safe:animate-otp-shake')
        expect(markup).not.toContain('motion-safe:transition-')
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
