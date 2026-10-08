export type TimeInputLogicResult = {
    state: {
        safeValue: string
        error: string | null
        hasError: boolean
        isFocused: boolean
        effectiveShowLength: boolean
        counterText: string
        dynamicPaddingRight: number
        inputProps: import('react').InputHTMLAttributes<HTMLInputElement>
        label: import('react').ReactNode
        icon: import('react').ReactNode
        description: import('react').ReactNode
        externalError: string | null | undefined
        disabled: boolean | undefined
        nativeRequired: boolean | undefined
        ariaErrorMessage: string | undefined
        readOnly: boolean | undefined
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
        hourPartLabelId: string
        minutePartLabelId: string
        hourPartAria:
            | {
                  'aria-label': undefined
                  'aria-labelledby': string | undefined
              }
            | {
                  'aria-label': string
                  'aria-labelledby': undefined
              }
        minutePartAria:
            | {
                  'aria-label': undefined
                  'aria-labelledby': string | undefined
              }
            | {
                  'aria-label': string
                  'aria-labelledby': undefined
              }
        fieldRequired: ('false' | 'true' | boolean) | undefined
        fieldAria: import('react').AriaAttributes
        design: Required<import('./InputShared.types.ts').CustomDesign>
        fieldClassName: string
        hasLeftIcon: boolean
        hours: string[]
        minutes: string[]
        selectedHour: string
        selectedMinute: string
        isHourDropdownOpen: boolean
        isMinuteDropdownOpen: boolean
    }
    handler: {
        handleFocus: (
            event: import('react').FocusEvent<HTMLInputElement, Element>,
        ) => void
        handleBlur: (
            event: import('react').FocusEvent<HTMLInputElement, Element>,
        ) => void
        handleInvalid: (
            event: import('react').InvalidEvent<HTMLInputElement>,
        ) => void
        handleNativeChange: (
            event: import('react').ChangeEvent<HTMLInputElement>,
        ) => void
        selectHour: (hour: string) => void
        selectMinute: (minute: string) => void
        toggleHourDropdown: () => void
        toggleMinuteDropdown: () => void
    }
    setter: {
        setIsHourDropdownOpen: import('react').Dispatch<
            import('react').SetStateAction<boolean>
        >
        setIsMinuteDropdownOpen: import('react').Dispatch<
            import('react').SetStateAction<boolean>
        >
    }
    refs: {
        field: import('react').RefCallback<
            HTMLInputElement | HTMLTextAreaElement
        >
        trigger: import('react').RefCallback<HTMLButtonElement>
        wrapper: import('react').RefObject<HTMLDivElement | null>
    }
}
