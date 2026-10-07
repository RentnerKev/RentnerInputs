import type { ReactNode } from 'react'
import type { InputLocale, InputMessages } from './Messages.types.js'
import type { CustomDesign } from './InputShared.types.js'

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
export type InputDefaults = Omit<InputProviderProps, 'children'>

export interface InputProviderLogicResult {
    state: { value: InputDefaults }
}
