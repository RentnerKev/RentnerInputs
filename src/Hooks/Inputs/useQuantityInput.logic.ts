import type { Ref } from 'react'
import type { QuantityInputComponentProps } from '../../Types/QuantityInput.types.js'
import { useInputMessages } from '../../InputProvider.js'
import {
    acceptsQuantity,
    validateNumber,
} from '../../Utils/inputValidation.utils.js'
import { useInputFieldLogic } from './useInputField.logic.js'

export default function useQuantityInputLogic(
    props: QuantityInputComponentProps,
    forwardedRef?: Ref<HTMLInputElement>,
) {
    const messages = useInputMessages(props.locale, props.messages)
    const field = useInputFieldLogic<HTMLInputElement>({
        ...props,
        validate: (value) =>
            validateNumber(value, props.minValue, props.maxValue, messages),
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
