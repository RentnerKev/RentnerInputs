import type { MoneyInputLogicResult } from '../../Types/MoneyInputLogicResult.types.js'
import type { Ref } from 'react'
import type { MoneyInputComponentProps } from '../../Types/MoneyInput.types.js'
import { useInputDefaults, useInputMessages } from '../useInputDefaults.js'
import {
    acceptsMoney,
    validateMoney,
} from '../../../../lib/Inputs/inputValidation.utils.js'
import { formatMoneyValue } from '../../../../lib/Inputs/money.utils.js'
import { useFieldValidation } from './useFieldValidation.js'

export default function useMoneyInputLogic(
    props: MoneyInputComponentProps,
    forwardedRef?: Ref<HTMLInputElement>,
): MoneyInputLogicResult {
    const defaults = useInputDefaults()
    const messages = useInputMessages(props.locale, props.messages)
    const locale = props.locale ?? defaults.locale ?? 'de'
    const field = useFieldValidation<HTMLInputElement>({
        ...props,
        validate: (value) => validateMoney(value, messages, locale),
        acceptsValue: (value) => acceptsMoney(value, locale),
        selectZeroOnFocus: true,
        forwardedRef,
    })
    let displayValue = field.state.safeValue

    if (!field.state.isFocused && displayValue) {
        displayValue =
            formatMoneyValue(displayValue, props.currency ?? 'EUR', locale) ??
            `${displayValue} ${props.currency ?? 'EUR'}`
    }

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
