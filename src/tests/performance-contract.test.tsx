import { describe, expect, spyOn, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { validateEmail } from '../lib/Inputs/inputValidation.utils.ts'
import { formatMoneyValue } from '../lib/Inputs/money.utils.ts'
import { PasswordInput } from '../shared/Inputs/Components/Inputs/PasswordInput.tsx'
import { TextInput } from '../shared/Inputs/Components/Inputs/TextInput.tsx'
import { Textarea } from '../shared/Inputs/Components/Inputs/Textarea.tsx'
import { TimeInput } from '../shared/Inputs/Components/Inputs/TimeInput.tsx'

describe('performance compatibility', () => {
    test('keeps the email grammar for exhaustive short strings and whitespace', () => {
        const former = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const alphabet = ['a', '.', '@', ' ', '\n', 'ü']
        for (let length = 0; length <= 6; length++) {
            for (let number = 0; number < alphabet.length ** length; number++) {
                let value = '',
                    rest = number
                for (let index = 0; index < length; index++) {
                    value += alphabet[rest % alphabet.length]
                    rest = Math.floor(rest / alphabet.length)
                }
                expect(validateEmail(value) === null).toBe(
                    !value || former.test(value),
                )
            }
        }
        for (const whitespace of [
            '\n',
            '\t',
            '\r',
            '\r\n',
            '\u00a0',
            '\u2028',
            '\u2029',
            '\ufeff',
        ]) {
            const value = `a@b.c${whitespace}`
            expect(former.test(value)).toBe(false)
            expect(validateEmail(value) === null).toBe(former.test(value))
        }
        for (const value of ['a@..b', 'a@b..', '.@...'])
            expect(validateEmail(value)).toBeNull()
    })

    test('rejects adversarial long emails without restricting normal long values', () => {
        for (const length of [4000, 8000, 16000, 100000]) {
            expect(validateEmail(`a@${'.'.repeat(length)}@`)).not.toBeNull()
            expect(validateEmail(`${'a'.repeat(length)}@b.c`)).toBeNull()
        }
    })

    test('reuses money formatters, keeps precision and evicts bounded currency entries', () => {
        const original = Intl.NumberFormat
        let constructions = 0
        Intl.NumberFormat = new Proxy(original, {
            construct(target, args) {
                constructions++
                return Reflect.construct(target, args)
            },
        })
        try {
            const expected = formatMoneyValue(
                '9007199254740993,123456',
                'EUR',
                'de',
            )
            const afterFirst = constructions
            for (let index = 0; index < 100; index++) {
                expect(
                    formatMoneyValue('9007199254740993,123456', 'EUR', 'de'),
                ).toBe(expected)
            }
            expect(constructions).toBe(afterFirst)
            expect(expected).toContain('9.007.199.254.740.993,123456')
            for (let index = 0; index < 80; index++) {
                formatMoneyValue(
                    '1234,56',
                    `X${String.fromCharCode(65 + Math.floor(index / 26))}${String.fromCharCode(65 + (index % 26))}`,
                    'de',
                )
            }
            const afterChurn = constructions
            formatMoneyValue('1234,56', 'EUR', 'de')
            expect(constructions).toBeGreaterThan(afterChurn)
            expect(() => formatMoneyValue('1', 'invalid', 'de')).toThrow()
        } finally {
            Intl.NumberFormat = original
        }
    })

    test('only computes strength when enabled', () => {
        const password = 'r!Z9'.repeat(12500)
        const original = String.prototype.toLowerCase
        let scans = 0
        const scan = spyOn(String.prototype, 'toLowerCase').mockImplementation(
            function () {
                if (String(this) === password) scans++
                return original.call(this)
            },
        )
        try {
            renderToStaticMarkup(
                <PasswordInput
                    value={password}
                    onValueChange={() => undefined}
                    showPasswordStrength={false}
                />,
            )
            expect(scans).toBe(0)
            const html = renderToStaticMarkup(
                <PasswordInput
                    value={password}
                    onValueChange={() => undefined}
                    showPasswordStrength
                />,
            )
            expect(scans).toBeGreaterThan(0)
            expect(html).toContain('scaleX(')
        } finally {
            scan.mockRestore()
        }
    })

    test('SSR errors keep their message and ARIA outside the optional tooltip', () => {
        for (const Field of [TextInput, Textarea, TimeInput]) {
            const html = renderToStaticMarkup(
                <Field
                    id="field"
                    label="Field"
                    value=""
                    error="Required now"
                    onValueChange={() => undefined}
                />,
            )
            expect(html).toContain('id="field-error"')
            expect(html).toContain('Required now')
            expect(html).toContain('aria-invalid="true"')
            expect(html).toContain('aria-describedby="field-error"')
        }
    })
})
