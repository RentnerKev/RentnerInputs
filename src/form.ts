export interface FieldAdapter<T> {
    name: string
    state: {
        value: T
        meta?: { errors?: readonly unknown[]; isTouched?: boolean }
    }
    handleChange: (value: T) => void
    handleBlur: () => void
}
export interface FieldAdapterOptions {
    showErrors?: 'touched' | 'always' | 'never'
    mapError?: (error: unknown) => string | null | undefined
}
export function mapFieldError(error: unknown): string | null {
    if (typeof error === 'string') return error || null
    if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof error.message === 'string'
    )
        return error.message || null
    return null
}
export function getFieldError<T>(
    field: FieldAdapter<T>,
    options: FieldAdapterOptions = {},
): string | null {
    if (
        options.showErrors === 'never' ||
        (options.showErrors !== 'always' && !field.state.meta?.isTouched)
    )
        return null
    for (const error of field.state.meta?.errors ?? []) {
        const message = (options.mapError ?? mapFieldError)(error)
        if (message) return message
    }
    return null
}
export function getInputFieldProps<T>(
    field: FieldAdapter<T>,
    options: FieldAdapterOptions = {},
) {
    return {
        name: field.name,
        value: field.state.value,
        onValueChange: (value: T) => field.handleChange(value),
        onBlur: () => field.handleBlur(),
        error: getFieldError(field, options),
        validationMode: 'external' as const,
    }
}
