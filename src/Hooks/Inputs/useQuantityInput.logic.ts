import type { Ref } from 'react'
import type { QuantityInputProps } from '../../Types/QuantityInput.types.js'
import {
    acceptsQuantity,
    validateNumber,
} from '../../Utils/inputValidation.utils.js'
import { useInputFieldLogic } from './useInputField.logic.js'

export default function useQuantityInputLogic(
    props: QuantityInputProps,
    forwardedRef?: Ref<HTMLInputElement>,
) {
    const field = useInputFieldLogic<HTMLInputElement>({
        ...props,
        validate: (value) =>
            validateNumber(value, props.minValue, props.maxValue),
        acceptsValue: (value) =>
            acceptsQuantity(value) &&
            (value === '' ||
                props.maxValue === undefined ||
                Number(value) <= props.maxValue),
        selectZeroOnFocus: true,
        forwardedRef,
    })
    const displayValue =
        !field.state.isFocused && field.state.safeValue
            ? `${field.state.safeValue}${props.suffix ?? 'x'}`
            : field.state.safeValue

    return {
        ...field,
        state: { ...field.state, displayValue },
    }
}
