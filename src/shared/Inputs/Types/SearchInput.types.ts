import type { BaseInputProps } from './InputShared.types.js'

export interface SearchInputProps extends BaseInputProps {
    type?: 'search'
    onValueChange?: (value: string) => void
}

export type SearchInputValueProps = Omit<SearchInputProps, 'onChange'> & {
    onChange?: never
    onValueChange: (value: string) => void
}

export type SearchInputComponentProps = SearchInputProps | SearchInputValueProps
