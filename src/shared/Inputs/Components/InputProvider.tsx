import {
    InputContext,
    useInputProviderLogic,
} from '../Hooks/useInputDefaults.ts'
import type { InputProviderProps } from '../Types/InputProvider.types.ts'
export type {
    InputProviderProps,
    InputClassNames,
    InputValidationMode,
} from '../Types/InputProvider.types.ts'
export {
    useInputDefaults,
    useInputMessages,
} from '../Hooks/useInputDefaults.ts'

export function InputProvider(props: InputProviderProps) {
    const { state } = useInputProviderLogic(props)
    return (
        <InputContext.Provider value={state.value}>
            {props.children}
        </InputContext.Provider>
    )
}
