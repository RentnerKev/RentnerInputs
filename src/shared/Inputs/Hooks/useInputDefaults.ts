import { createContext, useContext, useMemo, useState } from 'react'
import { resolveInputMessages } from '../../../lib/Inputs/messages.ts'
import type { InputLocale, InputMessages } from '../Types/Messages.types.ts'
import type {
    InputDefaults,
    InputProviderProps,
    InputProviderLogicResult,
} from '../Types/InputProvider.types.ts'

const EMPTY_DEFAULTS: InputDefaults = {}

export const InputContext =
    /* @__PURE__ */ createContext<InputDefaults>(EMPTY_DEFAULTS)

export function useInputDefaults(): InputDefaults {
    return useContext(InputContext)
}

function shallowEqualRecord(a: object, b: object): boolean {
    const keysA = Object.keys(a)
    if (keysA.length !== Object.keys(b).length) return false
    const recA = a as Record<string, unknown>
    const recB = b as Record<string, unknown>
    for (let i = 0; i < keysA.length; i += 1) {
        const key = keysA[i]!
        if (!Object.is(recA[key], recB[key])) return false
    }
    return true
}

function useStableOptionalRecord<T extends object>(
    value: T | undefined,
): T | undefined {
    const [stable, setStable] = useState(value)
    if (stable === value) return stable
    if (stable && value && shallowEqualRecord(stable, value)) return stable
    setStable(value)
    return value
}

function mergeOptional<T extends object>(
    parent: T | undefined,
    local: T | undefined,
): T | undefined {
    if (!parent && !local) return undefined
    if (!local) return parent
    if (!parent) return { ...local }
    return { ...parent, ...local }
}

export function useInputProviderLogic({
    locale,
    messages,
    customDesign,
    classNames,
    validationMode,
    controlSize,
    portalContainer,
    portalClassName,
    portalZIndex,
}: InputProviderProps): InputProviderLogicResult {
    const parent = useInputDefaults()
    const stableMessages = useStableOptionalRecord(messages)
    const stableCustomDesign = useStableOptionalRecord(customDesign)
    const stableClassNames = useStableOptionalRecord(classNames)

    const mergedMessages = useMemo(
        () => mergeOptional(parent.messages, stableMessages),
        [parent.messages, stableMessages],
    )
    const mergedCustomDesign = useMemo(
        () => mergeOptional(parent.customDesign, stableCustomDesign),
        [parent.customDesign, stableCustomDesign],
    )
    const mergedClassNames = useMemo(
        () => mergeOptional(parent.classNames, stableClassNames),
        [parent.classNames, stableClassNames],
    )
    const nextControlSize = controlSize ?? parent.controlSize
    const nextPortalContainer =
        portalContainer === undefined ? parent.portalContainer : portalContainer
    const nextPortalClassName = portalClassName ?? parent.portalClassName
    const nextPortalZIndex = portalZIndex ?? parent.portalZIndex
    const nextLocale = locale ?? parent.locale
    const nextValidationMode = validationMode ?? parent.validationMode

    const value = useMemo<InputDefaults>(
        () => ({
            controlSize: nextControlSize,
            portalContainer: nextPortalContainer,
            portalClassName: nextPortalClassName,
            portalZIndex: nextPortalZIndex,
            locale: nextLocale,
            validationMode: nextValidationMode,
            messages: mergedMessages,
            customDesign: mergedCustomDesign,
            classNames: mergedClassNames,
        }),
        [
            nextControlSize,
            nextPortalContainer,
            nextPortalClassName,
            nextPortalZIndex,
            nextLocale,
            nextValidationMode,
            mergedMessages,
            mergedCustomDesign,
            mergedClassNames,
        ],
    )
    return { state: { value } }
}

export function useInputMessages(
    locale?: InputLocale,
    messages?: Partial<InputMessages>,
) {
    const defaults = useInputDefaults()
    const resolvedLocale = locale ?? defaults.locale
    return useMemo(() => {
        if (!defaults.messages && !messages) {
            return resolveInputMessages(resolvedLocale)
        }
        return resolveInputMessages(
            resolvedLocale,
            !messages
                ? defaults.messages
                : !defaults.messages
                  ? messages
                  : { ...defaults.messages, ...messages },
        )
    }, [resolvedLocale, defaults.messages, messages])
}
