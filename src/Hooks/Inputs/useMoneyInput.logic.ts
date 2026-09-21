import type { Ref } from 'react'
import type { MoneyInputProps } from '../../Types/MoneyInput.types.js'
import {
    resolveInputIntlLocale,
    resolveInputMessages,
} from '../../Config/messages.js'
import {
    acceptsMoney,
    validateMoney,
} from '../../Utils/inputValidation.utils.js'
import { useInputFieldLogic } from './useInputField.logic.js'

export default function useMoneyInputLogic(
    props: MoneyInputProps,
    forwardedRef?: Ref<HTMLInputElement>,
) {
    const messages = resolveInputMessages(props.locale, props.messages)
    const field = useInputFieldLogic<HTMLInputElement>({
        ...props,
        validate: (value) => validateMoney(value, messages),
        acceptsValue: acceptsMoney,
        selectZeroOnFocus: true,
        forwardedRef,
    })
    let displayValue = field.state.safeValue

    if (!field.state.isFocused && displayValue) {
        const numericValue = Number.parseFloat(
            displayValue.replace(/\./g, '').replace(',', '.'),
        )
        displayValue = Number.isNaN(numericValue)
            ? `${displayValue} ${props.currency ?? 'EUR'}`
            : new Intl.NumberFormat(resolveInputIntlLocale(props.locale), {
                  style: 'currency',
                  currency: props.currency ?? 'EUR',
              }).format(numericValue)
    }

    return {
        ...field,
        state: { ...field.state, displayValue },
    }
}
