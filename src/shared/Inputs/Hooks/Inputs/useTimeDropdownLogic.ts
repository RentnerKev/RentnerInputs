import type { TimeDropdownLogicResult } from '../../Types/TimeDropdownLogicResult.types.ts'
import {
    useRef,
    useId,
    useEffect,
    useLayoutEffect,
    useState,
    type FocusEvent,
    type MouseEvent as ReactMouseEvent,
    type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { mergeAriaDescribedBy } from '../../../../lib/Inputs/fieldA11y.utils.ts'
import type { TimeDropdownProps } from '../../Types/TimeDropdown.types.ts'
function getDeepActiveElement(ownerDocument: Document): Element | null {
    let active = ownerDocument.activeElement
    while (active?.shadowRoot?.activeElement)
        active = active.shadowRoot.activeElement
    return active
}
export default function useTimeDropdownLogic({
    label,
    value,
    disabled,
    options,
    isOpen,
    fieldAria,
    onClose,
    onToggle,
    onSelect,
}: TimeDropdownProps): TimeDropdownLogicResult {
    const rootRef = useRef<HTMLDivElement | null>(null)
    const [position, setPosition] = useState({
        top: 0,
        left: 0,
        width: 0,
        maxHeight: 208,
    })
    useLayoutEffect(() => {
        if (!isOpen) return
        function updatePosition() {
            const rect = rootRef.current?.getBoundingClientRect()
            if (!rect) return
            const roomBelow = window.innerHeight - rect.bottom - 12
            const height = Math.min(208, Math.max(roomBelow, rect.top - 12))
            setPosition({
                top:
                    roomBelow >= Math.min(208, rect.top - 12)
                        ? rect.bottom + 6
                        : Math.max(6, rect.top - height - 6),
                left: rect.left,
                width: rect.width,
                maxHeight: Math.max(48, height),
            })
        }
        updatePosition()
        window.addEventListener('resize', updatePosition)
        window.addEventListener('scroll', updatePosition, true)
        return () => {
            window.removeEventListener('resize', updatePosition)
            window.removeEventListener('scroll', updatePosition, true)
        }
    }, [isOpen])
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
        const trigger = rootRef.current?.querySelector<HTMLButtonElement>(
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

    useEffect(() => {
        if (!isOpen) return
        function handleOutside(event: MouseEvent) {
            const target = event.composedPath()[0] ?? event.target
            if (
                target instanceof Node &&
                !rootRef.current?.contains(target) &&
                !listboxRef.current?.contains(target)
            ) {
                let active = listboxRef.current?.ownerDocument.activeElement
                while (active?.shadowRoot?.activeElement)
                    active = active.shadowRoot.activeElement
                if (
                    active instanceof HTMLElement &&
                    listboxRef.current?.contains(active)
                )
                    active.blur()
                onClose()
            }
        }
        document.addEventListener('mousedown', handleOutside)
        return () => document.removeEventListener('mousedown', handleOutside)
    }, [isOpen, onClose])
    function focusOptionAt(index: number) {
        const optionElements =
            listboxRef.current?.querySelectorAll<HTMLButtonElement>(
                '[role="option"]',
            )
        optionElements?.[index]?.focus()
    }

    function handleOptionKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
        if (event.key === 'Tab') {
            // Let the browser compute the next real tab stop from the logical trigger.
            // It knows inert/hidden elements, radio groups, and positive tabindex ordering.
            if (event.shiftKey) event.preventDefault()
            focusTrigger()
            onClose()
            return
        }
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
            (option) =>
                option ===
                getDeepActiveElement(
                    listboxRef.current?.ownerDocument ?? document,
                ),
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
        const root = event.currentTarget
        const containsFocus = (target: EventTarget | null) =>
            target instanceof Node &&
            (root.contains(target) ||
                Boolean(listboxRef.current?.contains(target)))
        if (containsFocus(nextTarget)) return
        const popupRoot = listboxRef.current?.getRootNode()
        if (
            nextTarget instanceof Element &&
            popupRoot instanceof ShadowRoot &&
            popupRoot.host === nextTarget
        ) {
            queueMicrotask(() => {
                if (
                    !containsFocus(
                        getDeepActiveElement(nextTarget.ownerDocument),
                    )
                )
                    onClose()
            })
            return
        }
        onClose()
    }

    function handleTriggerMouseDown(event: ReactMouseEvent<HTMLButtonElement>) {
        if (event.button !== 0 || disabled) return
        // WebKit otherwise blurs an already focused button before click opens the popup.
        event.preventDefault()
        event.currentTarget.focus()
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
            position,
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
            handleTriggerMouseDown,
            handleSelect,
        },
        refs: { listboxRef, rootRef },
    }
}
