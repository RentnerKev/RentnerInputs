import type { AriaAttributes } from 'react'

export function mergeAriaDescribedBy(
    ...values: Array<string | undefined | null>
) {
    const ids = values.flatMap((value) =>
        value?.trim() ? value.trim().split(/\s+/) : [],
    )

    return [...new Set(ids)].join(' ') || undefined
}

export function partitionAriaProps<Props extends object>(props: Props) {
    const ariaProps: Record<string, unknown> = {}
    const otherProps: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(props)) {
        if (key.startsWith('aria-')) {
            ariaProps[key] = value
        } else {
            otherProps[key] = value
        }
    }

    return {
        ariaProps: ariaProps as AriaAttributes,
        otherProps: otherProps as Omit<Props, keyof AriaAttributes>,
    }
}
