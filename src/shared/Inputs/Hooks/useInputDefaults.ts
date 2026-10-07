import { createContext, useContext, useMemo } from 'react'
import { resolveInputMessages } from '../../../lib/Inputs/messages.js'
import type { InputLocale, InputMessages } from '../Types/Messages.types.js'
import type {
    InputDefaults,
    InputProviderProps,
    InputProviderLogicResult,
} from '../Types/InputProvider.types.js'

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
}: InputProviderProps): InputProviderLogicResult {
    const parent = useInputDefaults()
    const value = useMemo<InputDefaults>(
        () => ({
            locale: locale ?? parent.locale,
            validationMode: validationMode ?? parent.validationMode,
            messages: { ...parent.messages, ...messages },
            customDesign: { ...parent.customDesign, ...customDesign },
            classNames: { ...parent.classNames, ...classNames },
        }),
        [parent, locale, messages, customDesign, classNames, validationMode],
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
