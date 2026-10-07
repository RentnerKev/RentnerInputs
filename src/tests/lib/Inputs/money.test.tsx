import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { MoneyInput } from '../../../shared/Inputs/Components/Inputs/MoneyInput.js'
import { InputProvider } from '../../../shared/Inputs/Components/InputProvider.js'
import {
    acceptsMoney,
    validateMoney,
} from '../../../lib/Inputs/inputValidation.utils.js'
import {
    formatMoneyValue,
    parseMoneyValue,
} from '../../../lib/Inputs/money.utils.js'

describe('money input locale parsing', () => {
    test('parses decimal and grouping separators for the selected locale', () => {
        expect(parseMoneyValue('1234.56', 'en')).toBe(1234.56)
        expect(parseMoneyValue('1,234.56', 'en')).toBe(1234.56)
        expect(parseMoneyValue('1234,56', 'de')).toBe(1234.56)
        expect(parseMoneyValue('1.234,56', 'de')).toBe(1234.56)
        expect(parseMoneyValue('1.2.3', 'en')).toBeUndefined()
        expect(parseMoneyValue('1,23', 'en')).toBeUndefined()
    })

    test('validates grouping structure while allowing edit prefixes', () => {
        expect(acceptsMoney('1,234.56', 'en')).toBe(true)
        expect(acceptsMoney('1,23', 'en')).toBe(true)
        expect(validateMoney('1,23', undefined, 'en')).not.toBeNull()
        expect(acceptsMoney('12,34,567', 'en')).toBe(false)
        expect(acceptsMoney('1.23.4', 'de')).toBe(false)
        expect(acceptsMoney('1,234.', 'en')).toBe(true)
        expect(validateMoney('1,234.', undefined, 'en')).toBeNull()
    })

    test('parses localized Arabic digits and separators', () => {
        const localizedValue = new Intl.NumberFormat('ar-EG', {
            useGrouping: true,
            maximumFractionDigits: 2,
        }).format(1234.56)

        expect(parseMoneyValue(localizedValue, 'ar-EG')).toBe(1234.56)
        expect(acceptsMoney(localizedValue, 'ar-EG')).toBe(true)
        expect(formatMoneyValue(localizedValue, 'EGP', 'ar-EG')).toBe(
            new Intl.NumberFormat('ar-EG', {
                style: 'currency',
                currency: 'EGP',
            }).format(1234.56),
        )
    })

    test('accepts locale grouping whitespace and Indian group sizes', () => {
        const frenchValue = new Intl.NumberFormat('fr-FR', {
            useGrouping: true,
            maximumFractionDigits: 2,
        }).format(1234.56)

        expect(
            parseMoneyValue(
                frenchValue.replace(/[\u00a0\u202f]/gu, ' '),
                'fr-FR',
            ),
        ).toBe(1234.56)
        expect(parseMoneyValue('12,34,567.89', 'en-IN')).toBe(1234567.89)
        expect(parseMoneyValue('1,234,567.89', 'en-IN')).toBeUndefined()
    })

    test('detects Spanish grouping separators for large numbers', () => {
        expect(parseMoneyValue('1.234,56', 'es-ES')).toBe(1234.56)
        expect(parseMoneyValue('12.345', 'es-ES')).toBe(12345)
        expect(parseMoneyValue('12.345.678,901', 'es-ES')).toBe(12345678.901)
        expect(acceptsMoney('12.345.678,901', 'es-ES')).toBe(true)
    })

    test('formats an English decimal without multiplying it by 100', () => {
        const markup = renderToStaticMarkup(
            <MoneyInput
                value="1234.56"
                onChange={() => undefined}
                locale="en"
                currency="USD"
            />,
        )

        expect(markup).toContain('value="$1,234.56"')
    })

    test('keeps entered decimal precision in the blurred display', () => {
        expect(formatMoneyValue('1.239', 'USD', 'en')).toBe('$1.239')
        expect(formatMoneyValue('1.230', 'USD', 'en')).toBe('$1.230')
        expect(formatMoneyValue('12345678901234567890.123', 'USD', 'en')).toBe(
            '$12,345,678,901,234,567,890.123',
        )
    })

    test('submits the exact controlled decimal string through its form name', () => {
        const markup = renderToStaticMarkup(
            <MoneyInput
                name="amount"
                value="1.239"
                onChange={() => undefined}
                locale="en"
                currency="USD"
            />,
        )

        expect(markup).toContain('value="$1.239"')
        expect(markup).toContain('type="hidden" name="amount" value="1.239"')
        expect(markup).not.toMatch(/<input[^>]*type="text"[^>]*name="amount"/)
    })

    test('uses the provider locale when the field has no override', () => {
        const markup = renderToStaticMarkup(
            <InputProvider locale="en">
                <MoneyInput
                    value="1234.56"
                    onChange={() => undefined}
                    currency="USD"
                />
            </InputProvider>,
        )

        expect(markup).toContain('value="$1,234.56"')
    })

    test('normalizes underscore locales before formatting with Intl', () => {
        expect(
            renderToStaticMarkup(
                <MoneyInput
                    value="1234.56"
                    onChange={() => undefined}
                    locale="en_GB"
                    currency="GBP"
                />,
            ),
        ).toContain('value="£1,234.56"')
    })
})
