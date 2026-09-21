import type { BaseInputProps } from './InputShared.types.js'

export interface PasswordInputProps extends BaseInputProps {
    type?: 'password'
    showPasswordStrength?: boolean
}
