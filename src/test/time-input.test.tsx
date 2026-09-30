import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { TimeInput } from '../Components/Inputs/TimeInput.js'
import { createMinuteOptions } from '../Hooks/Inputs/useTimeInput.logic.js'

describe('time input keyboard and option contracts', () => {
    test('gives the hour and minute triggers distinct accessible names', () => {
        const markup = renderToStaticMarkup(
            <TimeInput
                id="appointment"
                label="Appointment time"
                value=""
                onChange={() => undefined}
            />,
        )

        expect(markup).toContain(
            'aria-labelledby="appointment-label appointment-hour-part-label"',
        )
        expect(markup).toContain(
            'aria-labelledby="appointment-label appointment-minute-part-label"',
        )
    })

    test('adds the selected part to a consumer-provided aria label', () => {
        const markup = renderToStaticMarkup(
            <TimeInput
                id="delivery-time"
                aria-label="Delivery time"
                value=""
                onChange={() => undefined}
            />,
        )

        expect(markup).toContain('aria-label="Delivery time Stunde auswählen"')
        expect(markup).toContain('aria-label="Delivery time Minute auswählen"')
    })

    test('uses only integer minute labels when minuteStep is invalid', () => {
        const expectedMinutes = Array.from({ length: 60 }, (_, minute) =>
            String(minute).padStart(2, '0'),
        )

        expect(createMinuteOptions(1.5)).toEqual(expectedMinutes)
        expect(createMinuteOptions(0)).toEqual(expectedMinutes)
        expect(createMinuteOptions(-5)).toEqual(expectedMinutes)
    })

    test('generates valid minute options for an integer step', () => {
        expect(createMinuteOptions(5)).toEqual([
            '00',
            '05',
            '10',
            '15',
            '20',
            '25',
            '30',
            '35',
            '40',
            '45',
            '50',
            '55',
        ])
        expect(createMinuteOptions(60)).toEqual(['00'])
    })
})
