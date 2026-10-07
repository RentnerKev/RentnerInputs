import type { QuantityInputLogicResult } from '../../Types/QuantityInputLogicResult.types.js'
import type { Ref } from 'react'
import type { QuantityInputComponentProps } from '../../Types/QuantityInput.types.js'
import { useInputMessages } from '../useInputDefaults.js'
import {
    acceptsQuantity,
    validateNumber,
} from '../../../../lib/Inputs/inputValidation.utils.js'
import { useFieldValidation } from './useFieldValidation.js'

export default function useQuantityInputLogic(
    props: QuantityInputComponentProps,
    forwardedRef?: Ref<HTMLInputElement>,
): QuantityInputLogicResult {
    const messages = useInputMessages(props.locale, props.messages)
    const field = useFieldValidation<HTMLInputElement>({
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
        refs: { field: field.refs.field },
        handler: {
            handleInputChange: field.handler.handleInputChange,
            handleFocus: field.handler.handleFocus,
            handleBlur: field.handler.handleBlur,
            handleInvalid: field.handler.handleInvalid,
        },
        setter: {
            setIsTouched: field.setter.setIsTouched,
            setIsFocused: field.setter.setIsFocused,
            setNativeError: field.setter.setNativeError,
        },
        state: {
            safeValue: field.state.safeValue,
            error: field.state.error,
            hasError: field.state.hasError,
            isFocused: field.state.isFocused,
            effectiveShowLength: field.state.effectiveShowLength,
            counterText: field.state.counterText,
            dynamicPaddingRight: field.state.dynamicPaddingRight,
            displayValue,
        },
    }
}
