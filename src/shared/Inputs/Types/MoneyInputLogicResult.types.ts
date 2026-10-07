export type MoneyInputLogicResult = {
    refs: {
        field: import('react').RefCallback<
            HTMLInputElement | HTMLTextAreaElement
        >
    }
    handler: {
        handleInputChange: (
            event: import('react').ChangeEvent<HTMLInputElement, Element>,
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
    }
    state: {
        safeValue: string
        error: string | null
        hasError: boolean
        isFocused: boolean
        effectiveShowLength: boolean
        counterText: string
        dynamicPaddingRight: number
        displayValue: string
    }
}
