export type PasswordInputLogicResult = {
    refs: {
        field: import('react').RefCallback<
            HTMLInputElement | HTMLTextAreaElement
        >
    }
    state: {
        design: Required<import('./InputShared.types.ts').CustomDesign>
        messages: Required<import('./Messages.types.ts').InputMessages>
        safeValue: string
        error: string | null
        hasError: boolean
        isFocused: boolean
        effectiveShowLength: boolean
        counterText: string
        showPassword: boolean
        passwordStrength:
            | import('./InputShared.types.ts').PasswordStrength
            | undefined
        shouldShowPasswordStrength: boolean
        dynamicPaddingRight: number
    }
    handler: {
        handleInputChange: (
            event: import('react').ChangeEvent<HTMLInputElement>,
        ) => void
        handleFocus: (
            event: import('react').FocusEvent<HTMLInputElement, Element>,
        ) => void
        handleBlur: (
            event: import('react').FocusEvent<HTMLInputElement, Element>,
        ) => void
        handleInvalid: (
            event: import('react').InvalidEvent<HTMLInputElement>,
        ) => void
        togglePassword: () => void
    }
    setter: {
        setIsTouched: import('react').Dispatch<
            import('react').SetStateAction<boolean>
        >
        setIsFocused: import('react').Dispatch<
            import('react').SetStateAction<boolean>
        >
        setNativeError: import('react').Dispatch<
            import('react').SetStateAction<string | null>
        >
        setShowPassword: import('react').Dispatch<
            import('react').SetStateAction<boolean>
        >
    }
}
