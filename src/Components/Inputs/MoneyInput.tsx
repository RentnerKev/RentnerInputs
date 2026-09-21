import { forwardRef } from 'react'
import useMoneyInputLogic from '../../Hooks/Inputs/useMoneyInput.logic.js'
import type { MoneyInputProps } from '../../Types/MoneyInput.types.js'
import { InputField } from './InputField.js'

export const MoneyInput = forwardRef<HTMLInputElement, MoneyInputProps>(
    function MoneyInput({ type: _type, currency, locale, ...props }, ref) {
        void _type
        const originalProps = { ...props, currency, locale }
        const logic = useMoneyInputLogic(originalProps, ref)
        return (
            <InputField
                {...props}
                logic={logic}
                inputType="text"
                displayValue={logic.state.displayValue}
                inputMode={props.inputMode ?? 'decimal'}
            />
        )
    },
)
