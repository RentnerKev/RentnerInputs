import { useEffect, useMemo, useRef, useState } from 'react'
import type { Ref } from 'react'
import type { TimeInputComponentProps } from '../../Types/TimeInput.types.js'
import { useInputMessages } from '../../InputProvider.js'
import { useInputFieldLogic } from './useInputField.logic.js'
import { useComposedRefs } from '../useComposedRefs.js'

function formatTimePart(value: number) {
    return String(value).padStart(2, '0')
}

export function createMinuteOptions(minuteStep: number | undefined) {
    const safeMinuteStep =
        minuteStep !== undefined &&
        Number.isInteger(minuteStep) &&
        minuteStep > 0 &&
        minuteStep <= 60
            ? minuteStep
            : 1

    return Array.from({ length: Math.ceil(60 / safeMinuteStep) }, (_, index) =>
        formatTimePart(Math.min(index * safeMinuteStep, 59)),
    )
}

export interface TimeConstraintOptions {
    min?: string | number
    max?: string | number
    step?: number | string
    value?: string
}

interface TimeOptionConstraints extends TimeConstraintOptions {
    minuteStep?: number
}

export interface TimeOptions {
    hours: string[]
    minutesByHour: Record<string, string[]>
}

interface ResolvedTimeConstraints {
    minSeconds?: number
    maxSeconds?: number
    stepBase: number
    stepSeconds?: number
}

function parseTimeSeconds(value: string | number | undefined) {
    if (value === undefined || value === '') return undefined
    const match = /^(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?$/.exec(
        String(value),
    )
    if (!match) return undefined

    const [, hourText, minuteText, secondText = '00', fractionText = ''] = match
    const hour = Number(hourText)
    const minute = Number(minuteText)
    const second = Number(
        `${secondText}${fractionText ? `.${fractionText}` : ''}`,
    )
    if (hour > 23 || minute > 59 || second >= 60) return undefined
    return hour * 3600 + minute * 60 + second
}

function resolveTimeConstraints({
    min,
    max,
    step,
    value,
}: TimeConstraintOptions): ResolvedTimeConstraints {
    const minSeconds = parseTimeSeconds(min)
    const numericStep = typeof step === 'number' ? step : Number(step)
    const stepSeconds =
        step === 'any'
            ? undefined
            : Number.isFinite(numericStep) && numericStep > 0
              ? numericStep
              : 60

    return {
        minSeconds,
        maxSeconds: parseTimeSeconds(max),
        stepBase: minSeconds ?? parseTimeSeconds(value) ?? 0,
        stepSeconds,
    }
}

function isTimeSecondsValid(
    candidate: number,
    { minSeconds, maxSeconds, stepBase, stepSeconds }: ResolvedTimeConstraints,
) {
    const outsideRange =
        minSeconds !== undefined && maxSeconds !== undefined
            ? minSeconds <= maxSeconds
                ? candidate < minSeconds || candidate > maxSeconds
                : candidate < minSeconds && candidate > maxSeconds
            : (minSeconds !== undefined && candidate < minSeconds) ||
              (maxSeconds !== undefined && candidate > maxSeconds)
    const offStep =
        stepSeconds !== undefined &&
        Math.abs(
            (candidate - stepBase) / stepSeconds -
                Math.round((candidate - stepBase) / stepSeconds),
        ) > 1e-8

    return !outsideRange && !offStep
}

export function isTimeValueValid(
    value: string,
    constraints: TimeConstraintOptions,
) {
    if (value === '') return true
    const candidate = parseTimeSeconds(value)
    if (candidate === undefined) return false
    return isTimeSecondsValid(candidate, resolveTimeConstraints(constraints))
}

export function createTimeOptions({
    minuteStep,
    min,
    max,
    step,
    value,
}: TimeOptionConstraints): TimeOptions {
    const minuteOptions = createMinuteOptions(minuteStep)
    const resolvedConstraints = resolveTimeConstraints({
        min,
        max,
        step,
        value,
    })
    const allHours = Array.from({ length: 24 }, (_, index) =>
        formatTimePart(index),
    )
    const minutesByHour = Object.fromEntries(
        allHours.map((hour) => {
            const hourNumber = Number(hour)
            const validMinutes = minuteOptions.filter((minute) => {
                const candidate = hourNumber * 3600 + Number(minute) * 60
                return isTimeSecondsValid(candidate, resolvedConstraints)
            })
            return [hour, validMinutes]
        }),
    ) as Record<string, string[]>

    return {
        hours: allHours.filter((hour) => minutesByHour[hour].length > 0),
        minutesByHour,
    }
}

function getTimePart(value: string, index: number) {
    const parts = value.split(':')
    const part = parts[index]
    return part && /^\d{2}$/.test(part) ? part : ''
}

export default function useTimeInputLogic(
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
    const field = useInputFieldLogic<HTMLInputElement>({
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
            handleNativeChange: field.handler.handleInputChange,
        },
        setter: {
            ...field.setter,
            setIsHourDropdownOpen,
            setIsMinuteDropdownOpen,
        },
    }
}
