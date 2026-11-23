import type { AriaAttributes } from 'react'

export function mergeAriaDescribedBy(
    ...values: Array<string | undefined | null>
) {
    let out = ''
    for (let i = 0; i < values.length; i += 1) {
        const value = values[i]
        if (!value) continue
        if (!/\s/.test(value)) {
            if (!out) out = value
            else if (out !== value && !` ${out} `.includes(` ${value} `)) {
                out += ` ${value}`
            }
            continue
        }
        const parts = value.split(/\s+/)
        for (let j = 0; j < parts.length; j += 1) {
            const id = parts[j]
            if (id && out !== id && !` ${out} `.includes(` ${id} `)) {
                out = out ? `${out} ${id}` : id
            }
        }
    }
    return out || undefined
}

export function partitionAriaProps<Props extends object>(props: Props) {
    const ariaProps: Record<string, unknown> = {}
    const otherProps: Record<string, unknown> = {}

    for (const key in props) {
        if (!Object.prototype.hasOwnProperty.call(props, key)) continue
        const value = (props as Record<string, unknown>)[key]
        if (key.charCodeAt(0) === 97 && key.startsWith('aria-')) {
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
