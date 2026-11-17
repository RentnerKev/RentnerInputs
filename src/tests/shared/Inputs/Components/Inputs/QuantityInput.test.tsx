import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import useQuantityInputLogic from '../../../../../shared/Inputs/Hooks/Inputs/useQuantityInputLogic.ts'
import type { QuantityInputComponentProps } from '../../../../../shared/Inputs/Types/QuantityInput.types.ts'
import { QuantityInput } from '../../../../../shared/Inputs/Components/Inputs/QuantityInput.tsx'

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

function QuantityValidation(props: QuantityInputComponentProps) {
    const { state } = useQuantityInputLogic({ ...props, locale: 'en' })
    return <span>{state.error ?? 'valid'}</span>
}

test.each([
    [{ value: '1', min: 2 }, 'The value must be at least 2'],
    [{ value: '11', max: '10' }, 'The value must be at most 10'],
    [{ value: '3', min: '5', minValue: 1 }, 'The value must be at least 5'],
    [{ value: '7', max: 5, maxValue: 9 }, 'The value must be at most 5'],
    [{ value: '3', minValue: 5 }, 'The value must be at least 5'],
    [{ value: '7', maxValue: 5 }, 'The value must be at most 5'],
    [{ value: '1', min: '', minValue: 5 }, 'valid'],
    [{ value: '99', max: '', maxValue: 5 }, 'valid'],
    [{ value: '1', min: 'invalid', minValue: 5 }, 'valid'],
    [{ value: '99', max: 'Infinity', maxValue: 5 }, 'valid'],
    [{ value: '', min: 5, max: 10 }, 'valid'],
    [{ value: '1', max: 0, maxValue: 5 }, 'The value must be at most 0'],
] satisfies [Partial<QuantityInputComponentProps>, string][])(
    'quantity validates resolved native and alias bounds: %j',
    (bounds, message) => {
        expect(
            renderToStaticMarkup(
                <QuantityValidation
                    value=""
                    onValueChange={() => {}}
                    {...bounds}
                />,
            ),
        ).toBe(`<span>${message}</span>`)
    },
)
