import { forwardRef } from 'react'
import useNumberInputLogic from '../../Hooks/Inputs/useNumberInputLogic.ts'
import type { NumberInputComponentProps } from '../../Types/NumberInput.types.ts'
import { InputField } from './InputField.tsx'

export const NumberInput = forwardRef<
    HTMLInputElement,
    NumberInputComponentProps
>(function NumberInput({ type: _type, minValue, maxValue, ...props }, ref) {
    void _type
    const originalProps = { ...props, minValue, maxValue }
    const logic = useNumberInputLogic(originalProps, ref)
    return (
        <InputField
            {...props}
            min={logic.state.min}
            max={logic.state.max}
            logic={logic}
            inputType="number"
        />
    )
})
