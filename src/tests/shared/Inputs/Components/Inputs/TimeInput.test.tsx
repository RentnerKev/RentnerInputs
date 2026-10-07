import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { TimeInput } from '../../../../../shared/Inputs/Components/Inputs/TimeInput.js'
import {
    createMinuteOptions,
    createTimeOptions,
    isTimeValueValid,
} from '../../../../../lib/Inputs/timeOptions.js'

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

    test('adds the selected part to a consumer-provided accessible name', () => {
        const markup = renderToStaticMarkup(
            <TimeInput
                id="delivery-time"
                aria-label="Delivery time"
                value=""
                onChange={() => undefined}
            />,
        )

        expect(markup).toContain('>Delivery time Stunde auswählen</span>')
        expect(markup).toContain('>Delivery time Minute auswählen</span>')
        expect(markup.match(/aria-labelledby=/g)).toHaveLength(2)
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

    test('intersects minute options with native min, max, and step seconds', () => {
        const options = createTimeOptions({
            minuteStep: 5,
            min: '09:10',
            max: '09:40',
            step: 900,
            value: '',
        })

        expect(options.hours).toEqual(['09'])
        expect(options.minutesByHour['09']).toEqual(['10', '25', '40'])
    })

    test('validates native time constraints with the same seconds rules as options', () => {
        const constraints = {
            min: '09:10',
            max: '09:40',
            step: 900,
            value: '09:10',
        }

        expect(isTimeValueValid('09:10', constraints)).toBe(true)
        expect(isTimeValueValid('09:25', constraints)).toBe(true)
        expect(isTimeValueValid('09:20', constraints)).toBe(false)
        expect(isTimeValueValid('09:05', constraints)).toBe(false)
        expect(isTimeValueValid('09:45', constraints)).toBe(false)
        expect(isTimeValueValid('09:5', constraints)).toBe(false)
        expect(isTimeValueValid('', constraints)).toBe(true)
    })

    test('supports wrapping ranges and any native step', () => {
        const options = createTimeOptions({
            minuteStep: 30,
            min: '22:00',
            max: '02:00',
            step: 'any',
        })

        expect(options.hours).toEqual(['00', '01', '02', '22', '23'])
        expect(options.minutesByHour['00']).toEqual(['00', '30'])
        expect(options.minutesByHour['12']).toEqual([])
    })

    test('uses the controlled value as the native step base when no min exists', () => {
        const options = createTimeOptions({
            minuteStep: 1,
            step: '900',
            value: '09:07',
        })

        expect(options.minutesByHour['09']).toEqual(['07', '22', '37', '52'])
        expect(options.minutesByHour['10']).toEqual(['07', '22', '37', '52'])
    })
})
