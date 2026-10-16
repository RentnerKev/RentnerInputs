import { createContext, useContext, useMemo } from 'react'
import { resolveInputMessages } from '../../../lib/Inputs/messages.ts'
import type { InputLocale, InputMessages } from '../Types/Messages.types.ts'
import type {
    InputDefaults,
    InputProviderProps,
    InputProviderLogicResult,
} from '../Types/InputProvider.types.ts'

export const InputContext = createContext<InputDefaults>({})
export function useInputDefaults(): InputDefaults {
    return useContext(InputContext)
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
    const value = useMemo<InputDefaults>(
        () => ({
            controlSize: controlSize ?? parent.controlSize,
            portalContainer:
                portalContainer === undefined
                    ? parent.portalContainer
                    : portalContainer,
            portalClassName: portalClassName ?? parent.portalClassName,
            portalZIndex: portalZIndex ?? parent.portalZIndex,
            locale: locale ?? parent.locale,
            validationMode: validationMode ?? parent.validationMode,
            messages: { ...parent.messages, ...messages },
            customDesign: { ...parent.customDesign, ...customDesign },
            classNames: { ...parent.classNames, ...classNames },
        }),
        [
            parent,
            locale,
            messages,
            customDesign,
            classNames,
            validationMode,
            controlSize,
            portalContainer,
            portalClassName,
            portalZIndex,
        ],
    )
    return { state: { value } }
}
export function useInputMessages(
    locale?: InputLocale,
    messages?: Partial<InputMessages>,
) {
    const defaults = useInputDefaults()
    return resolveInputMessages(locale ?? defaults.locale, {
        ...defaults.messages,
        ...messages,
    })
}
