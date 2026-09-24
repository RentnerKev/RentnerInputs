import { forwardRef } from 'react'
import useNumberInputLogic, {
    resolveNumberBound,
} from '../../Hooks/Inputs/useNumberInput.logic.js'
import type { NumberInputComponentProps } from '../../Types/NumberInput.types.js'
import { InputField } from './InputField.js'

export const NumberInput = forwardRef<
    HTMLInputElement,
    NumberInputComponentProps
>(function NumberInput({ type: _type, minValue, maxValue, ...props }, ref) {
    void _type
    const originalProps = { ...props, minValue, maxValue }
    const logic = useNumberInputLogic(originalProps, ref)
    const min = resolveNumberBound(props.min, minValue)
    const max = resolveNumberBound(props.max, maxValue)
    return (
        <InputField
            {...props}
            min={min}
            max={max}
            logic={logic}
            inputType="number"
        />
    )
})
