import type { Ref } from 'react'
import type { NumberInputLogicResult } from '../../Types/NumberInputLogicResult.types.ts'
import type { NumberInputComponentProps } from '../../Types/NumberInput.types.ts'
import { useInputMessages } from '../useInputDefaults.ts'
import {
    validateNumber,
    resolveNumberBound,
} from '../../../../lib/Inputs/inputValidation.utils.ts'
import { useFieldValidation } from './useFieldValidation.ts'

export default function useNumberInputLogic(
    props: NumberInputComponentProps,
    forwardedRef?: Ref<HTMLInputElement>,
): NumberInputLogicResult {
    const messages = useInputMessages(props.locale, props.messages)
    const minValue = resolveNumberBound(props.min, props.minValue)
    const maxValue = resolveNumberBound(props.max, props.maxValue)

    const field = useFieldValidation<HTMLInputElement>({
        ...props,
        validate: (value) =>
            validateNumber(value, minValue, maxValue, messages),
        acceptsValue: (value) =>
            value === '' ||
            maxValue === undefined ||
            Number.isNaN(Number(value)) ||
            Number(value) <= maxValue,
        selectZeroOnFocus: true,
        forwardedRef,
    })
    return {
        state: {
            safeValue: field.state.safeValue,
            error: field.state.error,
            hasError: field.state.hasError,
            isFocused: field.state.isFocused,
            effectiveShowLength: field.state.effectiveShowLength,
            counterText: field.state.counterText,
            dynamicPaddingRight: field.state.dynamicPaddingRight,
            min: minValue,
            max: maxValue,
        },
        handler: {
            handleInputChange: field.handler.handleInputChange,
            handleFocus: field.handler.handleFocus,
            handleBlur: field.handler.handleBlur,
            handleInvalid: field.handler.handleInvalid,
        },
        refs: { field: field.refs.field },
    }
}
