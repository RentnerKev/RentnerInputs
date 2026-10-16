import { useState } from 'react'
import { getInputFieldProps } from '@rentnerkev/inputs/form'
export function useNumericFieldLogic() {
    const [numericValue, setNumericValue] = useState<number | null>(null)
    const [isTouched, setIsTouched] = useState(false)
    const numericProps = getInputFieldProps({
        name: 'numericValue',
        state: { value: numericValue, meta: { isTouched, errors: [] } },
        handleChange: setNumericValue,
        handleBlur: () => setIsTouched(true),
    })
    return { state: { numericValue, numericProps } }
}
