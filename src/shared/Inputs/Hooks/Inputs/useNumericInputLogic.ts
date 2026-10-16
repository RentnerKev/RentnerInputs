import { useState, type Ref } from 'react'
import type { NumericInputProps } from '../../Types/NumericInput.types.ts'
import { useInputMessages } from '../useInputDefaults.ts'
import {
    validateNumber,
    resolveNumberBound,
} from '../../../../lib/Inputs/inputValidation.utils.ts'
import { parseNumericDraft } from '../../../../lib/Inputs/numeric.utils.ts'
import type { NumericInputLogicResult } from '../../Types/NumericInputLogicResult.types.ts'
import { useFieldValidation } from './useFieldValidation.ts'
export default function useNumericInputLogic(
    props: NumericInputProps,
    ref: Ref<HTMLInputElement>,
): NumericInputLogicResult {
    const messages = useInputMessages(props.locale, props.messages)
    const [draft, setDraft] = useState(
        props.value === null ? '' : String(props.value),
    )
    const [previousValue, setPreviousValue] = useState(props.value)
    if (!Object.is(previousValue, props.value)) {
        setPreviousValue(props.value)
        setDraft(props.value === null ? '' : String(props.value))
    }
    const field = useFieldValidation<HTMLInputElement>({
        ...props,
        value: draft,
        forwardedRef: ref,
        onValueChange: setDraft,
        validate: (value) =>
            parseNumericDraft(value) === undefined
                ? messages.invalidInput
                : validateNumber(
                      value.replace(',', '.'),
                      resolveNumberBound(props.min, undefined),
                      resolveNumberBound(props.max, undefined),
                      messages,
                  ),
        onBlur: (event) => {
            if (props.disabled || props.readOnly) {
                props.onBlur?.(event)
                return
            }
            const parsed = parseNumericDraft(draft)
            if (parsed !== undefined) {
                props.onValueChange(parsed)
                setDraft(props.value === null ? '' : String(props.value))
            } else setDraft(props.value === null ? '' : String(props.value))
            props.onBlur?.(event)
        },
    })
    function handleKeyDown(
        event: import('react').KeyboardEvent<HTMLInputElement>,
    ) {
        if (event.key === 'Enter') event.currentTarget.blur()
        props.onKeyDown?.(event)
    }
    return {
        state: {
            safeValue: field.state.safeValue,
            error: field.state.error,
            hasError: field.state.hasError,
            isFocused: field.state.isFocused,
            effectiveShowLength: field.state.effectiveShowLength,
            counterText: field.state.counterText,
            dynamicPaddingRight: field.state.dynamicPaddingRight,
        },
        handler: {
            handleInputChange: field.handler.handleInputChange,
            handleFocus: field.handler.handleFocus,
            handleBlur: field.handler.handleBlur,
            handleInvalid: field.handler.handleInvalid,
            handleKeyDown,
        },
        refs: { field: field.refs.field },
    }
}
