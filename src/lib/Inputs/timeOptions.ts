import type {
    TimeConstraintOptions,
    TimeOptionConstraints,
    TimeOptions,
    ResolvedTimeConstraints,
} from './Types/timeOptions.types.ts'
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

export function getTimePart(value: string, index: number) {
    const parts = value.split(':')
    const part = parts[index]
    return part && /^\d{2}$/.test(part) ? part : ''
}

export type {
    TimeConstraintOptions,
    TimeOptions,
} from './Types/timeOptions.types.ts'
