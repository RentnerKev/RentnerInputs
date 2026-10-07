import type { AriaAttributes, Ref } from 'react'
export interface TimeDropdownProps {
    label: string
    value: string
    placeholder: string
    options: string[]
    isOpen: boolean
    id?: string
    disabled?: boolean
    readOnly?: boolean
    buttonRef?: Ref<HTMLButtonElement>
    fieldAria?: AriaAttributes
    onToggle: () => void
    onClose: () => void
    onSelect: (value: string) => void
}
