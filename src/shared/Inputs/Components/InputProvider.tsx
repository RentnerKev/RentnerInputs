import {
    InputContext,
    useInputProviderLogic,
} from '../Hooks/useInputDefaults.js'
import type { InputProviderProps } from '../Types/InputProvider.types.js'
export type {
    InputProviderProps,
    InputClassNames,
    InputValidationMode,
} from '../Types/InputProvider.types.js'
export {
    useInputDefaults,
    useInputMessages,
} from '../Hooks/useInputDefaults.js'

export function InputProvider(props: InputProviderProps) {
    const { state } = useInputProviderLogic(props)
    return (
        <InputContext.Provider value={state.value}>
            {props.children}
        </InputContext.Provider>
    )
}
