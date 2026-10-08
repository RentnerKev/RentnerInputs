import { useTooltipClientReady } from '../../Hooks/useTooltipClientReady.ts'
import type {
    ErrorTooltipProps,
    TooltipBoundaryProps,
    TooltipBoundaryState,
} from '../../Types/ErrorTooltip.types.ts'
import { Component, lazy, Suspense } from 'react'
import { AlertCircle } from 'lucide-react'

const Tooltip = lazy(() =>
    import('@rentnerkev/tooltips').then((module) => ({
        default: module.CustomTooltip,
    })),
)

// A rejected optional chunk must never take down the surrounding field/form.
class TooltipBoundary extends Component<
    TooltipBoundaryProps,
    TooltipBoundaryState
> {
    state = { failed: false }
    static getDerivedStateFromError() {
        return { failed: true }
    }
    render() {
        return this.state.failed ? this.props.fallback : this.props.children
    }
}

export function ErrorTooltip({ content, className }: ErrorTooltipProps) {
    // Keep the server and first hydration render identical. The optional tooltip
    // only loads on the client; the field's error paragraph remains immediate.
    const clientReady = useTooltipClientReady()
    const icon = <AlertCircle className={className} />
    if (!clientReady) return icon
    return (
        <TooltipBoundary fallback={icon}>
            <Suspense fallback={icon}>
                <Tooltip content={content} side="bottom">
                    {icon}
                </Tooltip>
            </Suspense>
        </TooltipBoundary>
    )
}
