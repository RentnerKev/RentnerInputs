import { forwardRef } from 'react'
import { useFieldValidation } from '../../Hooks/Inputs/useFieldValidation.js'
import type { SearchInputComponentProps } from '../../Types/SearchInput.types.js'
import { InputField } from './InputField.js'

export type {
    SearchInputProps,
    SearchInputValueProps,
    SearchInputComponentProps,
} from '../../Types/SearchInput.types.js'

export const SearchInput = forwardRef<
    HTMLInputElement,
    SearchInputComponentProps
>(function SearchInput({ type: _type, ...props }, ref) {
    void _type
    const logic = useFieldValidation<HTMLInputElement>({
        ...props,
        forwardedRef: ref,
    })
    return <InputField {...props} logic={logic} inputType="search" />
})
