import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { QuantityInput } from '../Components/Inputs/QuantityInput.js'

describe('quantity input form value', () => {
    test('submits the raw controlled value instead of the blurred suffix', () => {
        const markup = renderToStaticMarkup(
            <QuantityInput
                name="quantity"
                form="order-form"
                value="5"
                onChange={() => undefined}
                suffix="kg"
            />,
        )

        expect(markup).toContain('value="5kg"')
        expect(markup).toMatch(
            /<input(?=[^>]*type="hidden")(?=[^>]*name="quantity")(?=[^>]*form="order-form")(?=[^>]*value="5")[^>]*>/,
        )
        expect(markup).not.toMatch(
            /<input(?=[^>]*type="text")(?=[^>]*name="quantity")/,
        )
    })

    test('keeps a named quantity out of FormData when disabled', () => {
        const markup = renderToStaticMarkup(
            <QuantityInput
                name="quantity"
                value="5"
                onChange={() => undefined}
                disabled
            />,
        )

        expect(markup).toMatch(
            /<input(?=[^>]*type="hidden")(?=[^>]*name="quantity")(?=[^>]*disabled="")[^>]*>/,
        )
    })
})
