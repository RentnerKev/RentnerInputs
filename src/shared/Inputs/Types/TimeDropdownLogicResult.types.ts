import type { FocusEvent } from 'react'

export type TimeDropdownLogicResult = {
    state: {
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
        listboxRef: import('react').RefObject<HTMLDivElement | null>
    }
}
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
