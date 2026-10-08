export type OtpInputLogicResult = {
    state: {
        name: string | undefined
        label: import('react').ReactNode
        description: import('react').ReactNode
        error: string | null | undefined
        animated: boolean
        showProgress: boolean
        feedbackClassNames:
            | import('./OtpInput.types.ts').OtpFeedbackClassNames
            | undefined
        required: boolean | undefined
        disabled: boolean | undefined
        readOnly: boolean | undefined
        autoFocus: boolean | undefined
        className: string | undefined
        inputClassName: string | undefined
        ariaLabel: string | undefined
        defaults: import('./InputProvider.types.ts').InputDefaults
        design: Required<import('./InputShared.types.ts').CustomDesign>
        digits: string[]
        code: string
        digitCount: number
        resolvedMessages: Required<import('./Messages.types.ts').InputMessages>
        resolvedError: string | null
        hasError: boolean
        visualStatus: string
        groupId: string
        labelId: string
        descriptionId: string
        errorId: string
        successId: string
        isSuccess: boolean
        focusClasses: string
        idleClasses: string
        filledClasses: string
        errorClasses: string
        successClasses: string
        progressTrackClasses: string
        progressFilledClasses: string
        progressErrorClasses: string
        progressSuccessClasses: string
        hasLabel: boolean
        hasDescription: boolean
        describedBy: string | undefined
        labelledBy: string | undefined
    }
    handler: {
        handleInvalid: (
            event: import('react').InvalidEvent<HTMLInputElement>,
        ) => void
        handleGroupBlur: (
            event: import('react').FocusEvent<HTMLDivElement>,
        ) => void
        handleDigitChange: (index: number, rawValue: string) => void
        handleDigitKeyDown: (
            index: number,
            event: import('react').KeyboardEvent<HTMLInputElement>,
        ) => void
        handleDigitPaste: (
            index: number,
            event: import('react').ClipboardEvent<HTMLInputElement>,
        ) => void
    }
    refs: {
        validationInput: import('react').RefObject<HTMLInputElement | null>
        setDigitRef: (index: number, element: HTMLInputElement | null) => void
        firstDigitRef: import('react').RefCallback<HTMLInputElement>
    }
}
