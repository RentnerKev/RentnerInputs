import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEventHandler, Ref } from 'react'
import type { TimeInputProps } from '../../Types/TimeInput.types.js'
import { useInputFieldLogic } from './useInputField.logic.js'

function assignRef<Element>(
    ref: Ref<Element> | undefined,
    value: Element | null,
) {
    if (typeof ref === 'function') ref(value)
    else if (ref) ref.current = value
}

function formatTimePart(value: number) {
    return String(value).padStart(2, '0')
}

function getTimePart(value: string, index: number) {
    const parts = value.split(':')
    const part = parts[index]
    return part && /^\d{2}$/.test(part) ? part : ''
}

export default function useTimeInputLogic(
    props: TimeInputProps,
    forwardedRef?: Ref<HTMLInputElement>,
) {
    const [isHourDropdownOpen, setIsHourDropdownOpen] = useState(false)
    const [isMinuteDropdownOpen, setIsMinuteDropdownOpen] = useState(false)
    const hiddenInputRef = useRef<HTMLInputElement | null>(null)
    const triggerRef = useRef<HTMLButtonElement | null>(null)
    const wrapperRef = useRef<HTMLDivElement | null>(null)
    const { triggerRef: forwardedTriggerRef, ...fieldProps } = props
    const field = useInputFieldLogic<HTMLInputElement>({
        ...fieldProps,
        forwardedRef: setHiddenInputRef,
        focusTarget: () => triggerRef.current,
    })
    const safeMinuteStep =
        props.minuteStep && props.minuteStep > 0 ? props.minuteStep : 1
    const hours = useMemo(
        () => Array.from({ length: 24 }, (_, index) => formatTimePart(index)),
        [],
    )
    const minutes = useMemo(
        () =>
            Array.from({ length: Math.ceil(60 / safeMinuteStep) }, (_, index) =>
                formatTimePart(Math.min(index * safeMinuteStep, 59)),
            ),
        [safeMinuteStep],
    )
    const selectedHour = getTimePart(field.state.safeValue, 0)
    const selectedMinute = getTimePart(field.state.safeValue, 1)

    function setHiddenInputRef(element: HTMLInputElement | null) {
        hiddenInputRef.current = element
        assignRef(forwardedRef, element)
    }

    function setTriggerRef(element: HTMLButtonElement | null) {
        triggerRef.current = element
        assignRef(forwardedTriggerRef, element)
    }

    function dispatchTimeChange(nextValue: string) {
        if (props.disabled || props.readOnly) return
        const input = hiddenInputRef.current
        if (!input) return

        const valueSetter = Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            'value',
        )?.set
        valueSetter?.call(input, nextValue)
        input.dispatchEvent(new Event('input', { bubbles: true }))
    }

    function handleTimeChange(nextHour: string, nextMinute: string) {
        dispatchTimeChange(`${nextHour}:${nextMinute}`)
    }

    function selectHour(hour: string) {
        handleTimeChange(hour, selectedMinute || '00')
        setIsHourDropdownOpen(false)
    }

    function selectMinute(minute: string) {
        handleTimeChange(selectedHour || '00', minute)
        setIsMinuteDropdownOpen(false)
    }

    function toggleHourDropdown() {
        if (props.disabled || props.readOnly) return
        setIsHourDropdownOpen((currentValue) => !currentValue)
        setIsMinuteDropdownOpen(false)
    }

    function toggleMinuteDropdown() {
        if (props.disabled || props.readOnly) return
        setIsMinuteDropdownOpen((currentValue) => !currentValue)
        setIsHourDropdownOpen(false)
    }

    useEffect(() => {
        function handleDocumentMouseDown(event: MouseEvent) {
            if (!wrapperRef.current?.contains(event.target as Node)) {
                setIsHourDropdownOpen(false)
                setIsMinuteDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleDocumentMouseDown)
        return () =>
            document.removeEventListener('mousedown', handleDocumentMouseDown)
    }, [])

    return {
        ...field,
        ref: { ...field.ref, trigger: setTriggerRef, wrapper: wrapperRef },
        state: {
            ...field.state,
            hours,
            minutes,
            selectedHour,
            selectedMinute,
            isHourDropdownOpen,
            isMinuteDropdownOpen,
        },
        handler: {
            ...field.handler,
            selectHour,
            selectMinute,
            toggleHourDropdown,
            toggleMinuteDropdown,
            handleNativeChange:
                props.onChange as ChangeEventHandler<HTMLInputElement>,
        },
        setter: {
            ...field.setter,
            setIsHourDropdownOpen,
            setIsMinuteDropdownOpen,
        },
    }
}
