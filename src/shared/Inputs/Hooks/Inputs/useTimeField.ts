import { useEffect, useMemo, useRef, useState } from 'react'
import type { Ref } from 'react'
import type { TimeInputComponentProps } from '../../Types/TimeInput.types.js'
import { useInputMessages } from '../useInputDefaults.js'
import { useFieldValidation } from './useFieldValidation.js'
import { useComposedRefs } from '../useComposedRefs.js'

import {
    createTimeOptions,
    getTimePart,
    isTimeValueValid,
} from '../../../../lib/Inputs/timeOptions.js'

export default function useTimeField(
    props: TimeInputComponentProps,
    forwardedRef?: Ref<HTMLInputElement>,
) {
    const [isHourDropdownOpen, setIsHourDropdownOpen] = useState(false)
    const [isMinuteDropdownOpen, setIsMinuteDropdownOpen] = useState(false)
    const [supportsNativeTime, setSupportsNativeTime] = useState<
        boolean | null
    >(null)
    const hiddenInputRef = useRef<HTMLInputElement | null>(null)
    const triggerRef = useRef<HTMLButtonElement | null>(null)
    const wrapperRef = useRef<HTMLDivElement | null>(null)
    const { triggerRef: forwardedTriggerRef, ...fieldProps } = props
    const setHiddenInputRef = useComposedRefs(hiddenInputRef, forwardedRef)
    const setTriggerRef = useComposedRefs(triggerRef, forwardedTriggerRef)
    const messages = useInputMessages(props.locale, props.messages)
    const timeConstraints = useMemo(
        () => ({
            min: props.min,
            max: props.max,
            step: props.step,
            value: props.value,
        }),
        [props.max, props.min, props.step, props.value],
    )
    const field = useFieldValidation<HTMLInputElement>({
        ...fieldProps,
        validate: (value) =>
            supportsNativeTime === false &&
            !isTimeValueValid(value, timeConstraints)
                ? messages.invalidInput
                : null,
        forwardedRef: setHiddenInputRef,
        focusTarget: () => triggerRef.current,
    })
    const timeOptions = useMemo(
        () =>
            createTimeOptions({
                minuteStep: props.minuteStep,
                min: props.min,
                max: props.max,
                step: props.step,
                value: props.value,
            }),
        [props.minuteStep, props.min, props.max, props.step, props.value],
    )
    const hours = timeOptions.hours
    const selectedHour = getTimePart(field.state.safeValue, 0)
    const selectedMinute = getTimePart(field.state.safeValue, 1)
    const availableHour = hours.includes(selectedHour)
        ? selectedHour
        : (hours[0] ?? '')
    const minutes = timeOptions.minutesByHour[availableHour] ?? []

    useEffect(() => {
        const input = hiddenInputRef.current
        if (input) setSupportsNativeTime(input.type === 'time')
    }, [])

    useEffect(() => {
        const input = hiddenInputRef.current
        if (!input || supportsNativeTime !== false) return

        if (!input.willValidate || props.disabled || props.readOnly) {
            input.setCustomValidity('')
            return
        }

        const isValid = isTimeValueValid(field.state.safeValue, timeConstraints)
        const externalError =
            typeof props.error === 'string' && props.error.length > 0
                ? props.error
                : null
        input.setCustomValidity(
            externalError ?? (isValid ? '' : messages.invalidInput),
        )
    }, [
        field.state.safeValue,
        messages.invalidInput,
        props.disabled,
        props.error,
        props.readOnly,
        supportsNativeTime,
        timeConstraints,
    ])

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
        const hourMinutes = timeOptions.minutesByHour[hour] ?? []
        const minute = hourMinutes.includes(selectedMinute)
            ? selectedMinute
            : (hourMinutes[0] ?? '')
        if (!minute) return
        handleTimeChange(hour, minute)
        setIsHourDropdownOpen(false)
    }

    function selectMinute(minute: string) {
        if (!minutes.includes(minute) || !availableHour) return
        handleTimeChange(availableHour, minute)
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
        if (
            props.disabled ||
            props.readOnly ||
            (!isHourDropdownOpen && !isMinuteDropdownOpen)
        )
            return

        function handleDocumentMouseDown(event: MouseEvent) {
            if (!wrapperRef.current?.contains(event.target as Node)) {
                setIsHourDropdownOpen(false)
                setIsMinuteDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleDocumentMouseDown)
        return () =>
            document.removeEventListener('mousedown', handleDocumentMouseDown)
    }, [
        isHourDropdownOpen,
        isMinuteDropdownOpen,
        props.disabled,
        props.readOnly,
    ])

    return {
        refs: {
            field: field.refs.field,
            trigger: setTriggerRef,
            wrapper: wrapperRef,
        },
        state: {
            safeValue: field.state.safeValue,
            error: field.state.error,
            hasError: field.state.hasError,
            isFocused: field.state.isFocused,
            effectiveShowLength: field.state.effectiveShowLength,
            counterText: field.state.counterText,
            dynamicPaddingRight: field.state.dynamicPaddingRight,
            hours,
            minutes,
            selectedHour,
            selectedMinute,
            isHourDropdownOpen,
            isMinuteDropdownOpen,
        },
        handler: {
            handleInputChange: field.handler.handleInputChange,
            handleFocus: field.handler.handleFocus,
            handleBlur: field.handler.handleBlur,
            handleInvalid: field.handler.handleInvalid,
            selectHour,
            selectMinute,
            toggleHourDropdown,
            toggleMinuteDropdown,
            handleNativeChange: field.handler.handleInputChange,
        },
        setter: {
            setIsTouched: field.setter.setIsTouched,
            setIsFocused: field.setter.setIsFocused,
            setNativeError: field.setter.setNativeError,
            setIsHourDropdownOpen,
            setIsMinuteDropdownOpen,
        },
    }
}
