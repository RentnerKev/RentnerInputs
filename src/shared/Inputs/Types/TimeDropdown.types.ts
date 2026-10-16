import type { AriaAttributes, Ref } from 'react'
export interface TimeDropdownProps {
    fieldOwnerId?: string
    portalContainer?: Element | DocumentFragment | null
    portalClassName?: string
    portalZIndex?: number
    controlClassName?: string
    controlSizeClassName?: string
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
