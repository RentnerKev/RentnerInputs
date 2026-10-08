import { forwardRef } from 'react'
import { useFieldValidation } from '../../Hooks/Inputs/useFieldValidation.ts'
import type { SearchInputComponentProps } from '../../Types/SearchInput.types.ts'
import { InputField } from './InputField.tsx'

export type {
    SearchInputProps,
    SearchInputValueProps,
    SearchInputComponentProps,
} from '../../Types/SearchInput.types.ts'

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
