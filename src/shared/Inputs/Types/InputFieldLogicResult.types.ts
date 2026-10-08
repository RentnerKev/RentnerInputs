export type InputFieldLogicResult = {
    state: {
        logic: import('./InputField.types.ts').InputFieldProps['logic']
        inputType: import('react').HTMLInputTypeAttribute | undefined
        displayValue: string | undefined
        rightControl: import('react').ReactNode
        passwordStrength:
            | import('./InputShared.types.ts').PasswordStrength
            | undefined
        showPasswordStrength: boolean | undefined
        label: import('react').ReactNode
        nativeRequired: boolean | undefined
        icon: import('react').ReactNode
        description: import('react').ReactNode
        error: string | null | undefined
        showLength: boolean | undefined
        maxLength: number | undefined
        minLength: number | undefined
        disabled: boolean | undefined
        ariaErrorMessage: string | undefined
        ariaInvalid:
            | 'false'
            | 'grammar'
            | 'spelling'
            | 'true'
            | boolean
            | undefined
        ariaRequired: ('false' | 'true' | boolean) | undefined
        nativeProps: import('react').InputHTMLAttributes<HTMLInputElement>
        resolvedMessages: Required<import('./Messages.types.ts').InputMessages>
        fieldId: string
        labelId: string
        descriptionId: string
        errorId: string
        hasDescription: boolean
        hasLabel: boolean
        hasVisibleError: boolean
        describedBy: string | undefined
        labelledBy: string | undefined
        design: Required<import('./InputShared.types.ts').CustomDesign>
        hasLeftIcon: boolean
        fieldClassName: string
        passwordStrengthBarClass: string
    }
}
