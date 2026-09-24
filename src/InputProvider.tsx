import { createContext, useContext, useMemo, type ReactNode } from 'react'
import {
    resolveInputMessages,
    type InputLocale,
    type InputMessages,
} from './Config/messages.js'
import type { CustomDesign } from './Types/InputShared.types.js'

export interface InputClassNames {
    input?: string
    textarea?: string
    checkbox?: string
    radio?: string
    range?: string
    file?: string
    otp?: string
}

export type InputValidationMode = 'built-in' | 'external'

export interface InputProviderProps {
    children: ReactNode
    locale?: InputLocale
    messages?: Partial<InputMessages>
    customDesign?: CustomDesign
    classNames?: InputClassNames
    validationMode?: InputValidationMode
}

type InputDefaults = Omit<InputProviderProps, 'children'>

const InputContext = createContext<InputDefaults>({})

export function InputProvider({
    children,
    locale,
    messages,
    customDesign,
    classNames,
    validationMode,
}: InputProviderProps) {
    const parent = useContext(InputContext)
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

    return (
        <InputContext.Provider value={value}>{children}</InputContext.Provider>
    )
}

export function useInputDefaults(): InputDefaults {
    return useContext(InputContext)
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
