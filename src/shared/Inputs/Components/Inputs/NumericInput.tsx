import { forwardRef } from 'react'
import useNumericInputLogic from '../../Hooks/Inputs/useNumericInputLogic.ts'
import type { NumericInputProps } from '../../Types/NumericInput.types.ts'
import { InputField } from './InputField.tsx'
export type { NumericInputProps } from '../../Types/NumericInput.types.ts'
export const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>(
    function NumericInput({ name, ...props }, ref) {
        const logic = useNumericInputLogic(props, ref)
        return (
            <>
                <InputField
                    {...props}
                    value={logic.state.safeValue}
                    onValueChange={undefined}
                    onKeyDown={logic.handler.handleKeyDown}
                    logic={logic}
                    inputType="text"
                    inputMode={props.inputMode ?? 'decimal'}
                />
                {name !== undefined && (
                    <input
                        type="hidden"
                        name={name}
                        form={props.form}
                        value={props.value ?? ''}
                        disabled={props.disabled}
                    />
                )}
            </>
        )
    },
)
