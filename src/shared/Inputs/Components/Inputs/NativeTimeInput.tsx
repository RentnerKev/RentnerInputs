import { forwardRef } from 'react'
import { useFieldValidation } from '../../Hooks/Inputs/useFieldValidation.ts'
import type { NativeTimeInputComponentProps } from '../../Types/NativeTimeInput.types.ts'
import { InputField } from './InputField.tsx'

export type {
    NativeTimeInputProps,
    NativeTimeInputValueProps,
    NativeTimeInputComponentProps,
} from '../../Types/NativeTimeInput.types.ts'

export const NativeTimeInput = forwardRef<
    HTMLInputElement,
    NativeTimeInputComponentProps
>(function NativeTimeInput({ type: _type, ...props }, ref) {
    void _type
    const logic = useFieldValidation<HTMLInputElement>({
        ...props,
        forwardedRef: ref,
    })
    return <InputField {...props} logic={logic} inputType="time" />
})
