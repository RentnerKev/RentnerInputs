import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { MoneyInput } from '../Components/Inputs/MoneyInput.js'
import { InputProvider } from '../InputProvider.js'
import { formatMoneyValue, parseMoneyValue } from '../Utils/money.utils.js'

describe('money input locale parsing', () => {
    test('parses decimal and grouping separators for the selected locale', () => {
        expect(parseMoneyValue('1234.56', 'en')).toBe(1234.56)
        expect(parseMoneyValue('1,234.56', 'en')).toBe(1234.56)
        expect(parseMoneyValue('1234,56', 'de')).toBe(1234.56)
        expect(parseMoneyValue('1.234,56', 'de')).toBe(1234.56)
        expect(parseMoneyValue('1.2.3', 'en')).toBeUndefined()
        expect(parseMoneyValue('1,23', 'en')).toBeUndefined()
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
})
