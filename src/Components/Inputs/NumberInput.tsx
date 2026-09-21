import { forwardRef } from 'react'
import useNumberInputLogic from '../../Hooks/Inputs/useNumberInput.logic.js'
import type { NumberInputProps } from '../../Types/NumberInput.types.js'
import { InputField } from './InputField.js'

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
    function NumberInput({ type: _type, minValue, maxValue, ...props }, ref) {
        void _type
        const originalProps = { ...props, minValue, maxValue }
        const logic = useNumberInputLogic(originalProps, ref)
        return (
            <InputField
                {...props}
                min={props.min ?? minValue}
                max={props.max ?? maxValue}
                logic={logic}
                inputType="number"
            />
        )
    },
)
