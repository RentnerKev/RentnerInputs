import type { ChangeEventHandler, InputHTMLAttributes, ReactNode } from 'react'
import type { BaseInputProps, PasswordStrength } from './InputShared.types.js'
import type { InputFieldValidationResult } from './InputFieldValidation.types.js'

type InputFieldLogic = Pick<
    InputFieldValidationResult<HTMLInputElement>,
    'state' | 'handler' | 'refs'
>

export interface InputFieldProps extends Omit<BaseInputProps, 'onChange'> {
    logic: InputFieldLogic
    inputType: InputHTMLAttributes<HTMLInputElement>['type']
    onChange?: ChangeEventHandler<HTMLInputElement>
    onValueChange?: (value: string) => void
    displayValue?: string
    rightControl?: ReactNode
    passwordStrength?: PasswordStrength
    showPasswordStrength?: boolean
}
