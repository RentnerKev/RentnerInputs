import type {
    TimeConstraintOptions,
    TimeOptionConstraints,
    TimeOptions,
    ResolvedTimeConstraints,
} from './Types/timeOptions.types.ts'

const ALL_HOURS: readonly string[] = [
    '00',
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
]

const ALL_MINUTES: readonly string[] = /* @__PURE__ */ Array.from(
    { length: 60 },
    (_, index) => (index < 10 ? `0${index}` : String(index)),
)

const TIME_SECONDS_REGEX = /^(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?$/

export function createMinuteOptions(minuteStep: number | undefined) {
    const safeMinuteStep =
        minuteStep !== undefined &&
        Number.isInteger(minuteStep) &&
        minuteStep > 0 &&
        minuteStep <= 60
            ? minuteStep
            : 1

    if (safeMinuteStep === 1) return [...ALL_MINUTES]
    const count = Math.ceil(60 / safeMinuteStep)
    const options: string[] = []
    for (let index = 0; index < count; index += 1) {
        options.push(ALL_MINUTES[Math.min(index * safeMinuteStep, 59)]!)
    }
    return options
}

function parseTimeSeconds(value: string | number | undefined) {
    if (value === undefined || value === '') return undefined
    const str = typeof value === 'string' ? value : String(value)
    if (str.length === 5 && str.charCodeAt(2) === 58) {
        const h0 = str.charCodeAt(0) - 48
        const h1 = str.charCodeAt(1) - 48
        const m0 = str.charCodeAt(3) - 48
        const m1 = str.charCodeAt(4) - 48
        if (
            h0 >= 0 &&
            h0 <= 9 &&
            h1 >= 0 &&
            h1 <= 9 &&
            m0 >= 0 &&
            m0 <= 9 &&
            m1 >= 0 &&
            m1 <= 9
        ) {
            const hour = h0 * 10 + h1
            const minute = m0 * 10 + m1
            return hour <= 23 && minute <= 59
                ? hour * 3600 + minute * 60
                : undefined
        }
        return undefined
    }
    const match = TIME_SECONDS_REGEX.exec(str)
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
    if (outsideRange) return false
    if (stepSeconds === undefined) return true
    const ratio = (candidate - stepBase) / stepSeconds
    return Math.abs(ratio - Math.round(ratio)) <= 1e-8
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
    const safeMinuteStep =
        minuteStep !== undefined &&
        Number.isInteger(minuteStep) &&
        minuteStep > 0 &&
        minuteStep <= 60
            ? minuteStep
            : 1
    const minuteCount = Math.ceil(60 / safeMinuteStep)
    const minuteNumbers: number[] = []
    const minuteOptions: string[] = []
    for (let i = 0; i < minuteCount; i += 1) {
        const m = Math.min(i * safeMinuteStep, 59)
        minuteNumbers.push(m)
        minuteOptions.push(ALL_MINUTES[m]!)
    }

    const resolvedConstraints = resolveTimeConstraints({
        min,
        max,
        step,
        value,
    })
    const { minSeconds, maxSeconds, stepBase, stepSeconds } =
        resolvedConstraints

    const isEveryMinuteStepValid =
        stepSeconds === undefined ||
        (stepBase % 60 === 0 && (stepSeconds === 60 || 60 % stepSeconds === 0))

    if (
        minSeconds === undefined &&
        maxSeconds === undefined &&
        isEveryMinuteStepValid
    ) {
        const minutesByHour: Record<string, string[]> = {}
        for (let h = 0; h < 24; h += 1) {
            minutesByHour[ALL_HOURS[h]!] = minuteOptions
        }
        return {
            hours: [...ALL_HOURS],
            minutesByHour,
        }
    }

    const minutesByHour: Record<string, string[]> = {}
    const hours: string[] = []
    const normalRange =
        minSeconds === undefined ||
        maxSeconds === undefined ||
        minSeconds <= maxSeconds

    for (let h = 0; h < 24; h += 1) {
        const hourStr = ALL_HOURS[h]!
        const hourStart = h * 3600
        const hourEnd = hourStart + 59 * 60

        if (
            isEveryMinuteStepValid &&
            normalRange &&
            (minSeconds === undefined || hourStart >= minSeconds) &&
            (maxSeconds === undefined || hourEnd <= maxSeconds)
        ) {
            minutesByHour[hourStr] = minuteOptions
            hours.push(hourStr)
            continue
        }

        if (
            normalRange &&
            ((minSeconds !== undefined && hourEnd < minSeconds) ||
                (maxSeconds !== undefined && hourStart > maxSeconds))
        ) {
            minutesByHour[hourStr] = []
            continue
        }

        const validMinutes: string[] = []
        for (let i = 0; i < minuteCount; i += 1) {
            const candidate = hourStart + minuteNumbers[i]! * 60
            if (isTimeSecondsValid(candidate, resolvedConstraints)) {
                validMinutes.push(minuteOptions[i]!)
            }
        }
        minutesByHour[hourStr] = validMinutes
        if (validMinutes.length > 0) hours.push(hourStr)
    }

    return { hours, minutesByHour }
}

export function getTimePart(value: string, index: number) {
    if (!value) return ''
    if (index === 0) {
        if (
            value.length >= 2 &&
            (value.length === 2 || value.charCodeAt(2) === 58)
        ) {
            const d0 = value.charCodeAt(0) - 48
            const d1 = value.charCodeAt(1) - 48
            if (d0 >= 0 && d0 <= 9 && d1 >= 0 && d1 <= 9) {
                return value.slice(0, 2)
            }
            return ''
        }
    } else if (index === 1 && value.length >= 5 && value.charCodeAt(2) === 58) {
        if (value.length === 5 || value.charCodeAt(5) === 58) {
            const d0 = value.charCodeAt(3) - 48
            const d1 = value.charCodeAt(4) - 48
            if (d0 >= 0 && d0 <= 9 && d1 >= 0 && d1 <= 9) {
                return value.slice(3, 5)
            }
            return ''
        }
    }
    const parts = value.split(':')
    const part = parts[index]
    return part &&
        part.length === 2 &&
        part.charCodeAt(0) >= 48 &&
        part.charCodeAt(0) <= 57 &&
        part.charCodeAt(1) >= 48 &&
        part.charCodeAt(1) <= 57
        ? part
        : ''
}

export type {
    TimeConstraintOptions,
    TimeOptions,
} from './Types/timeOptions.types.ts'
