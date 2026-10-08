import { forwardRef } from 'react'
import useQuantityInputLogic from '../../Hooks/Inputs/useQuantityInputLogic.ts'
import type { QuantityInputComponentProps } from '../../Types/QuantityInput.types.ts'
import { InputField } from './InputField.tsx'

export const QuantityInput = forwardRef<
    HTMLInputElement,
    QuantityInputComponentProps
>(function QuantityInput(
    { type: _type, minValue, maxValue, suffix, name, ...props },
    ref,
) {
    void _type
    const originalProps = { ...props, minValue, maxValue, suffix }
    const logic = useQuantityInputLogic(originalProps, ref)
    return (
        <>
            <InputField
                {...props}
                min={props.min ?? minValue}
                max={props.max ?? maxValue}
                logic={logic}
                inputType="text"
                displayValue={logic.state.displayValue}
                inputMode={props.inputMode ?? 'numeric'}
            />
            {name !== undefined && (
                <input
                    type="hidden"
                    name={name}
                    form={props.form}
                    value={logic.state.safeValue}
                    disabled={props.disabled}
                />
            )}
        </>
    )
})
