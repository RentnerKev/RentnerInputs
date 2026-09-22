import { forwardRef } from 'react'
import { useInputFieldLogic } from '../../Hooks/Inputs/useInputField.logic.js'
import type { BaseInputProps } from '../../Types/InputShared.types.js'
import { InputField } from './InputField.js'

export interface SearchInputProps extends BaseInputProps {
    type?: 'search'
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    function SearchInput({ type: _type, ...props }, ref) {
        void _type
        const logic = useInputFieldLogic<HTMLInputElement>({
            ...props,
            forwardedRef: ref,
        })
        return <InputField {...props} logic={logic} inputType="search" />
    },
)
