import type { Ref } from 'react'
import type { MoneyInputComponentProps } from '../../Types/MoneyInput.types.js'
import { resolveInputIntlLocale } from '../../Config/messages.js'
import { useInputDefaults, useInputMessages } from '../../InputProvider.js'
import {
    acceptsMoney,
    validateMoney,
} from '../../Utils/inputValidation.utils.js'
import { parseMoneyValue } from '../../Utils/money.utils.js'
import { useInputFieldLogic } from './useInputField.logic.js'

export default function useMoneyInputLogic(
    props: MoneyInputComponentProps,
    forwardedRef?: Ref<HTMLInputElement>,
) {
    const defaults = useInputDefaults()
    const messages = useInputMessages(props.locale, props.messages)
    const locale = props.locale ?? defaults.locale
    const field = useInputFieldLogic<HTMLInputElement>({
        ...props,
        validate: (value) => validateMoney(value, messages),
        acceptsValue: acceptsMoney,
        selectZeroOnFocus: true,
        forwardedRef,
    })
    let displayValue = field.state.safeValue

    if (!field.state.isFocused && displayValue) {
        const numericValue = parseMoneyValue(displayValue, locale)
        displayValue =
            numericValue === undefined
                ? `${displayValue} ${props.currency ?? 'EUR'}`
                : new Intl.NumberFormat(resolveInputIntlLocale(locale), {
                      style: 'currency',
                      currency: props.currency ?? 'EUR',
                  }).format(numericValue)
    }

    return {
        ...field,
        state: { ...field.state, displayValue },
    }
}
