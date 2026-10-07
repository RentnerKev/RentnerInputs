export type TextareaLogicResult = {
    state: {
        safeValue: string
        error: string | null
        hasError: boolean
        isFocused: boolean
        effectiveShowLength: boolean
        counterText: string
        dynamicPaddingRight: number
        nativeProps: import('react').TextareaHTMLAttributes<HTMLTextAreaElement>
        label: import('react').ReactNode
        description: import('react').ReactNode
        externalError: string | null | undefined
        icon: import('react').ReactNode
        showLength: boolean | undefined
        maxLength: number | undefined
        minLength: number | undefined
        disabled: boolean | undefined
        nativeRequired: boolean | undefined
        ariaErrorMessage: string | undefined
        ariaInvalid:
            | 'false'
            | 'grammar'
            | 'spelling'
            | 'true'
            | boolean
            | undefined
        ariaRequired: ('false' | 'true' | boolean) | undefined
        rows: number
        fieldId: string
        descriptionId: string
        errorId: string
        hasDescription: boolean
        hasLabel: boolean
        hasVisibleError: boolean
        describedBy: string | undefined
        labelledBy: string | undefined
        design: Required<import('./InputShared.types.js').CustomDesign>
        hasLeftIcon: boolean
        fieldClassName: string
    }
    handler: {
        handleInputChange: (
            event: import('react').ChangeEvent<HTMLTextAreaElement, Element>,
        ) => void
        handleFocus: (
            event: import('react').FocusEvent<HTMLTextAreaElement, Element>,
        ) => void
        handleBlur: (
            event: import('react').FocusEvent<HTMLTextAreaElement, Element>,
        ) => void
        handleInvalid: (
            event: import('react').InvalidEvent<HTMLTextAreaElement>,
        ) => void
    }
    refs: {
        field: import('react').RefCallback<
            HTMLInputElement | HTMLTextAreaElement
        >
    }
}
