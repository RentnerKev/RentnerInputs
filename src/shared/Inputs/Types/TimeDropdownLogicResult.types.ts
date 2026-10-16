import type { FocusEvent } from 'react'

export type TimeDropdownLogicResult = {
    state: {
        position: {
            top: number
            left: number
            width: number
            maxHeight: number
        }
        labelledBy: string | undefined
        fallbackLabel: string
        accessibleName: string | undefined
        generatedLabelId: string
        valueId: string
    }
    handler: {
        handleOptionKeyDown: (event: ReactKeyboardEvent<HTMLDivElement>) => void
        handleBlur: (event: FocusEvent<HTMLDivElement>) => void
        handleTriggerKeyDown: (
            event: ReactKeyboardEvent<HTMLButtonElement>,
        ) => void
        handleSelect: (option: string) => void
    }
    refs: {
        rootRef: import('react').RefObject<HTMLDivElement | null>
        listboxRef: import('react').RefObject<HTMLDivElement | null>
    }
}
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
