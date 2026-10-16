import type { ReactNode } from 'react'
import type { InputLocale, InputMessages } from './Messages.types.ts'
import type { CustomDesign } from './InputShared.types.ts'

export interface InputClassNames {
    root?: string
    label?: string
    description?: string
    error?: string
    control?: string
    leading?: string
    trailing?: string
    counter?: string
    wrapper?: string
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
    controlSize?: 'sm' | 'md' | 'lg'
    portalContainer?: Element | DocumentFragment | null
    portalClassName?: string
    portalZIndex?: number
    children: ReactNode
    locale?: InputLocale
    messages?: Partial<InputMessages>
    customDesign?: CustomDesign
    classNames?: InputClassNames
    validationMode?: InputValidationMode
}
export type InputDefaults = Omit<InputProviderProps, 'children'>

export interface InputProviderLogicResult {
    state: { value: InputDefaults }
}
