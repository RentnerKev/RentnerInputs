export interface TimeConstraintOptions {
    min?: string | number
    max?: string | number
    step?: number | string
    value?: string
}

export interface TimeOptionConstraints extends TimeConstraintOptions {
    minuteStep?: number
}

export interface TimeOptions {
    hours: string[]
    minutesByHour: Record<string, string[]>
}

export interface ResolvedTimeConstraints {
    minSeconds?: number
    maxSeconds?: number
    stepBase: number
    stepSeconds?: number
}
