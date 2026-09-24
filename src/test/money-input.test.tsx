import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { MoneyInput } from '../Components/Inputs/MoneyInput.js'
import { InputProvider } from '../InputProvider.js'
import { parseMoneyValue } from '../Utils/money.utils.js'

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
