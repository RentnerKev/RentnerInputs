import { useMemo } from 'react'
import type { Ref, RefCallback } from 'react'

type OptionalRef<Element> = Ref<Element> | undefined

export function composeRefs<Element>(
    first: OptionalRef<Element>,
    second?: OptionalRef<Element>,
    third?: OptionalRef<Element>,
): RefCallback<Element> {
    const refs: Exclude<Ref<Element>, null>[] = []
    for (const ref of [first, second, third]) {
        if (ref != null && !refs.includes(ref)) refs.push(ref)
    }
    let activeCleanup: (() => void) | undefined

    return (element) => {
        if (element === null) {
            if (activeCleanup) {
                const cleanup = activeCleanup
                activeCleanup = undefined
                cleanup()
                return
            }

            refs.forEach((ref) => {
                if (typeof ref === 'function') ref(null)
                else ref.current = null
            })
            return
        }

        let hasCallbackCleanup = false
        const cleanupHandlers = refs.map((ref) => {
            if (typeof ref === 'function') {
                const cleanup = ref(element)
                if (typeof cleanup === 'function') {
                    hasCallbackCleanup = true
                    return cleanup
                }
                return () => ref(null)
            }

            ref.current = element
            return () => {
                ref.current = null
            }
        })

        if (!hasCallbackCleanup) return

        const cleanup = () => {
            let failed = false
            let firstError: unknown
            for (let index = cleanupHandlers.length - 1; index >= 0; index--) {
                try {
                    cleanupHandlers[index]?.()
                } catch (error) {
                    if (!failed) firstError = error
                    failed = true
                }
            }
            if (activeCleanup === cleanup) activeCleanup = undefined
            if (failed) throw firstError
        }

        activeCleanup = cleanup
        return cleanup
    }
}

function assignSingleRef<Element>(
    ref: OptionalRef<Element>,
    element: Element | null,
) {
    if (typeof ref === 'function') return ref(element)
    if (ref) ref.current = element
}

export function useComposedRefs<Element>(
    first: OptionalRef<Element>,
    second?: OptionalRef<Element>,
    third?: OptionalRef<Element>,
) {
    return useMemo(() => {
        if (second == null && third == null) {
            if (typeof first === 'function') return first
            return (element: Element | null) => assignSingleRef(first, element)
        }
        return composeRefs(first, second, third)
    }, [first, second, third])
}
