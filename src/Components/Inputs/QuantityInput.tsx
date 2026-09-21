import { forwardRef } from 'react'
import useQuantityInputLogic from '../../Hooks/Inputs/useQuantityInput.logic.js'
import type { QuantityInputProps } from '../../Types/QuantityInput.types.js'
import { InputField } from './InputField.js'

export const QuantityInput = forwardRef<HTMLInputElement, QuantityInputProps>(
    function QuantityInput(
        { type: _type, minValue, maxValue, suffix, ...props },
        ref,
    ) {
        void _type
        const originalProps = { ...props, minValue, maxValue, suffix }
        const logic = useQuantityInputLogic(originalProps, ref)
        return (
            <InputField
                {...props}
                min={props.min ?? minValue}
                max={props.max ?? maxValue}
                logic={logic}
                inputType="text"
                displayValue={logic.state.displayValue}
                inputMode={props.inputMode ?? 'numeric'}
            />
        )
    },
)
