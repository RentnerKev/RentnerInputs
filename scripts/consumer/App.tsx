import { useState } from 'react'
import {
    MoneyInput,
    QuantityInput,
    TextInput,
    TimeInput,
} from '@rentnerkev/inputs'

export function App() {
    const [requiredValue, setRequiredValue] = useState('')
    const [filteredValue, setFilteredValue] = useState('3')
    const [time, setTime] = useState('09:10')

    return (
        <div className="rounded-xl bg-background-dark p-6 text-white">
            <TextInput
                id="external-error"
                label="External error"
                value=""
                error="External error immediately"
                onValueChange={() => undefined}
            />
            <form
                id="consumer-form"
                aria-label="Consumer fields"
                className="space-y-5"
            >
                <QuantityInput
                    name="quantity"
                    label="Quantity"
                    value="5"
                    onValueChange={() => undefined}
                    suffix="kg"
                />
                <MoneyInput
                    name="money"
                    label="Money"
                    value="1.239"
                    onValueChange={() => undefined}
                    locale="en"
                    currency="USD"
                />
                <TextInput
                    id="required-value"
                    name="requiredValue"
                    label="Required value"
                    value={requiredValue}
                    onValueChange={setRequiredValue}
                    required
                />
                <button
                    type="button"
                    onClick={() => setRequiredValue('set by parent')}
                >
                    Set required value externally
                </button>
                <TimeInput
                    id="appointment"
                    name="appointment"
                    label="Appointment time"
                    value={time}
                    onValueChange={setTime}
                    minuteStep={5}
                    min="09:10"
                    max="09:40"
                    step={900}
                />
                <button type="button" onClick={() => setTime('09:20')}>
                    Set appointment to invalid time
                </button>
                <button type="button" onClick={() => setTime('09:10')}>
                    Set appointment to valid time
                </button>
            </form>
            <form id="filtered-form" aria-label="Filtered value form">
                <TextInput
                    id="filtered-value"
                    label="Filtered value"
                    value={filteredValue}
                    onValueChange={(nextValue) => {
                        if (nextValue !== '9') setFilteredValue(nextValue)
                    }}
                    pattern="[0-2]"
                />
                <button type="button" onClick={() => setFilteredValue('1')}>
                    Set filtered value externally
                </button>
                <button type="button" onClick={() => setFilteredValue('3')}>
                    Reset filtered value externally
                </button>
                <button type="button" onClick={() => setFilteredValue('4')}>
                    Set filtered value to another invalid value
                </button>
            </form>
        </div>
    )
}
