import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}
const clientSnapshot = () => true
const serverSnapshot = () => false

export function useTooltipClientReady() {
    return useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot)
}
