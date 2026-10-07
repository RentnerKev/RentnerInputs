import { describe, expect, test } from 'bun:test'
import { createRef } from 'react'
import { composeRefs } from '../../../../shared/Inputs/Hooks/useComposedRefs.js'

describe('composed refs', () => {
    test('runs React 19 callback cleanup and clears object and legacy refs', () => {
        const objectRef = createRef<HTMLInputElement>()
        const callbackCalls: Array<HTMLInputElement | null> = []
        let callbackCleanupCount = 0
        const cleanupAwareRef = (element: HTMLInputElement | null) => {
            callbackCalls.push(element)
            if (element) {
                return () => {
                    callbackCleanupCount++
                }
            }
        }
        const legacyCalls: Array<HTMLInputElement | null> = []
        const legacyRef = (element: HTMLInputElement | null) => {
            legacyCalls.push(element)
        }
        const input = {} as HTMLInputElement
        const composedRef = composeRefs(objectRef, cleanupAwareRef, legacyRef)

        const cleanup = composedRef(input)
        expect(objectRef.current).toBe(input)
        expect(callbackCalls).toEqual([input])
        expect(legacyCalls).toEqual([input])

        cleanup?.()
        expect(objectRef.current).toBeNull()
        expect(callbackCleanupCount).toBe(1)
        expect(callbackCalls).toEqual([input])
        expect(legacyCalls).toEqual([input, null])
    })

    test('clears all refs before rethrowing a consumer cleanup error', () => {
        const internal = createRef<HTMLInputElement>()
        const expectedError = new Error('Consumer cleanup failed')
        const legacyCalls: Array<HTMLInputElement | null> = []
        const composed = composeRefs(
            internal,
            (node) => {
                if (node)
                    return () => {
                        throw expectedError
                    }
            },
            (node) => {
                legacyCalls.push(node)
            },
        )
        const input = {} as HTMLInputElement
        const cleanup = composed(input)

        expect(() => cleanup?.()).toThrow(expectedError)
        expect(internal.current).toBeNull()
        expect(legacyCalls).toEqual([input, null])
    })

    test('deduplicates an identical public and trigger callback ref', () => {
        const calls: Array<HTMLInputElement | null> = []
        const sharedRef = (element: HTMLInputElement | null) => {
            calls.push(element)
            if (element) return () => calls.push(null)
        }
        const input = {} as HTMLInputElement
        const composedRef = composeRefs(sharedRef, sharedRef)

        const cleanup = composedRef(input)
        cleanup?.()

        expect(calls).toEqual([input, null])
    })

    test('clears object refs and notifies legacy callbacks on null teardown', () => {
        const objectRef = createRef<HTMLInputElement>()
        const calls: Array<HTMLInputElement | null> = []
        const legacyRef = (element: HTMLInputElement | null) => {
            calls.push(element)
        }
        const input = {} as HTMLInputElement
        const composedRef = composeRefs(objectRef, legacyRef)

        composedRef(input)
        composedRef(null)

        expect(objectRef.current).toBeNull()
        expect(calls).toEqual([input, null])
    })
})
