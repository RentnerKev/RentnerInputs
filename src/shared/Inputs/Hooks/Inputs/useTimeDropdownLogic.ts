import type { TimeDropdownLogicResult } from '../../Types/TimeDropdownLogicResult.types.js'
import {
    useRef,
    useId,
    useEffect,
    type FocusEvent,
    type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { mergeAriaDescribedBy } from '../../../../lib/Inputs/fieldA11y.utils.js'
import type { TimeDropdownProps } from '../../Types/TimeDropdown.types.js'
export default function useTimeDropdownLogic({
    label,
    value,
    options,
    isOpen,
    fieldAria,
    onClose,
    onToggle,
    onSelect,
}: TimeDropdownProps): TimeDropdownLogicResult {
    const listboxRef = useRef<HTMLDivElement | null>(null)
    const generatedLabelId = useId()
    const valueId = useId()
    const labelledBy =
        typeof fieldAria?.['aria-labelledby'] === 'string'
            ? fieldAria['aria-labelledby']
            : undefined
    const fallbackLabel =
        typeof fieldAria?.['aria-label'] === 'string'
            ? fieldAria['aria-label']
            : label
    const accessibleName = mergeAriaDescribedBy(
        labelledBy,
        labelledBy ? undefined : generatedLabelId,
        value ? valueId : undefined,
    )

    function focusTrigger() {
        const trigger = listboxRef.current
            ?.closest('div.relative')
            ?.querySelector<HTMLButtonElement>(
                'button[aria-haspopup="listbox"]',
            )
        trigger?.focus()
    }

    useEffect(() => {
        if (!isOpen) return

        const optionElements =
            listboxRef.current?.querySelectorAll<HTMLButtonElement>(
                '[role="option"]',
            )
        const selectedOption = Array.from(optionElements ?? []).find(
            (_, index) => options[index] === value,
        )
        const firstOption = optionElements?.[0]
        const initialOption = selectedOption ?? firstOption
        if (initialOption) initialOption.focus()
    }, [isOpen, listboxRef, options, value])

    function focusOptionAt(index: number) {
        const optionElements =
            listboxRef.current?.querySelectorAll<HTMLButtonElement>(
                '[role="option"]',
            )
        optionElements?.[index]?.focus()
    }

    function handleOptionKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
        if (event.key === 'Escape') {
            event.preventDefault()
            onClose()
            focusTrigger()
            return
        }

        const optionElements =
            listboxRef.current?.querySelectorAll<HTMLButtonElement>(
                '[role="option"]',
            )
        if (!optionElements?.length) return

        const activeIndex = Array.from(optionElements).findIndex(
            (option) => option === document.activeElement,
        )
        const selectedIndex = Array.from(optionElements).findIndex(
            (option) => option.getAttribute('aria-selected') === 'true',
        )
        const currentIndex =
            activeIndex >= 0 ? activeIndex : Math.max(selectedIndex, 0)
        let nextIndex: number | undefined

        if (event.key === 'ArrowDown') {
            nextIndex = (currentIndex + 1) % optionElements.length
        } else if (event.key === 'ArrowUp') {
            nextIndex =
                (currentIndex - 1 + optionElements.length) %
                optionElements.length
        } else if (event.key === 'Home') {
            nextIndex = 0
        } else if (event.key === 'End') {
            nextIndex = optionElements.length - 1
        } else if (event.key === 'PageDown') {
            nextIndex = Math.min(currentIndex + 10, optionElements.length - 1)
        } else if (event.key === 'PageUp') {
            nextIndex = Math.max(currentIndex - 10, 0)
        }

        if (nextIndex !== undefined) {
            event.preventDefault()
            focusOptionAt(nextIndex)
        }
    }

    function handleBlur(event: FocusEvent<HTMLDivElement>) {
        const nextTarget = event.relatedTarget
        if (
            !(nextTarget instanceof Node) ||
            !event.currentTarget.contains(nextTarget)
        ) {
            onClose()
        }
    }

    function handleTriggerKeyDown(
        event: ReactKeyboardEvent<HTMLButtonElement>,
    ) {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault()
            if (!isOpen) onToggle()
        }
    }
    function handleSelect(option: string) {
        onSelect(option)
        focusTrigger()
    }
    return {
        state: {
            labelledBy,
            fallbackLabel,
            accessibleName,
            generatedLabelId,
            valueId,
        },
        handler: {
            handleOptionKeyDown,
            handleBlur,
            handleTriggerKeyDown,
            handleSelect,
        },
        refs: { listboxRef },
    }
}
