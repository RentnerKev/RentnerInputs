import type { ReactNode } from 'react'

export interface ErrorTooltipProps {
    content: string
    className: string
}
export interface TooltipBoundaryProps {
    children: ReactNode
    fallback: ReactNode
}
export interface TooltipBoundaryState {
    failed: boolean
}
