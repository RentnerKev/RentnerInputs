import type { BaseInputProps } from './InputShared.types.js'

export interface PasswordInputProps extends BaseInputProps {
    type?: 'password'
    showPasswordStrength?: boolean
    onValueChange?: (value: string) => void
}

export type PasswordInputValueProps = Omit<PasswordInputProps, 'onChange'> & {
    onChange?: never
    onValueChange: (value: string) => void
}

export type PasswordInputComponentProps =
    | PasswordInputProps
    | PasswordInputValueProps
