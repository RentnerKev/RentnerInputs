import { describe, expect, test } from 'bun:test'
import { createElement, createRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { CustomInput } from '../Components/CustomInput.js'
import { Textarea } from '../Components/Inputs/Textarea.js'
import { TextInput } from '../Components/Inputs/TextInput.js'
import { TimeInput } from '../Components/Inputs/TimeInput.js'
import { mergeAriaDescribedBy } from '../Utils/fieldA11y.utils.js'

const noopChange = () => undefined

describe('shared input field contract', () => {
    test('merges consumer, description, and visible error descriptions', () => {
        const markup = renderToStaticMarkup(
            createElement(TextInput, {
                id: 'email',
                label: 'E-Mail',
                value: '',
                onChange: noopChange,
                description: 'Wir senden keine Werbung.',
                error: 'E-Mail bereits vergeben',
                'aria-describedby': 'external-help email-description',
                'aria-labelledby': 'external-label email-label',
                triggerRef: createRef<HTMLInputElement>(),
            }),
        )

        expect(markup).toContain('id="email-description"')
        expect(markup).toContain('id="email-error"')
        expect(markup).toContain(
            'aria-describedby="external-help email-description email-error"',
        )
        expect(markup).toContain('aria-labelledby="external-label email-label"')
        expect(markup).toContain('aria-invalid="true"')
        expect(markup).toContain('E-Mail bereits vergeben')
    })

    test('lets null clear internal errors and keeps description IDs stable', () => {
        const markup = renderToStaticMarkup(
            createElement(Textarea, {
                id: 'notes',
                value: '',
                onChange: noopChange,
                required: true,
                description: 'Optionaler Hinweis',
                error: null,
                'aria-describedby': 'consumer-help',
            }),
        )

        expect(markup).toContain('id="notes-description"')
        expect(markup).toContain(
            'aria-describedby="consumer-help notes-description"',
        )
        expect(markup).not.toContain('required=""')
        expect(markup).not.toContain('id="notes-error"')
        expect(markup).not.toContain('aria-invalid="true"')
        expect(markup).not.toContain('Dieses Feld ist erforderlich')
    })

    test('applies the same contract to CustomInput and TimeInput', () => {
        const customMarkup = renderToStaticMarkup(
            createElement(CustomInput, {
                type: 'textarea',
                id: 'custom-notes',
                value: '',
                onChange: noopChange,
                description: 'Zusatzinfo',
                error: 'Ungültiger Inhalt',
                'aria-describedby': 'custom-help',
            }),
        )
        const timeMarkup = renderToStaticMarkup(
            createElement(TimeInput, {
                id: 'time',
                label: 'Zeit',
                value: '',
                onChange: noopChange,
                description: 'Geschäftszeit',
                error: 'Zeit fehlt',
                triggerRef: createRef<HTMLButtonElement>(),
                'aria-describedby': 'time-help',
                'aria-controls': 'time-options',
                'aria-roledescription': 'time selector',
            }),
        )

        expect(customMarkup).toContain('id="custom-notes-description"')
        expect(customMarkup).toContain(
            'aria-describedby="custom-help custom-notes-description custom-notes-error"',
        )
        expect(timeMarkup).toContain('id="time-description"')
        expect(timeMarkup).toContain('for="time"')
        expect(timeMarkup).toContain('id="time-input"')
        expect(timeMarkup).toContain(
            'aria-describedby="time-help time-description time-error"',
        )
        expect(timeMarkup).toContain('aria-errormessage="time-error"')
        expect(timeMarkup).toMatch(
            /<button(?=[^>]*id="time")(?=[^>]*aria-labelledby="time-label")(?=[^>]*aria-describedby="time-help time-description time-error")(?=[^>]*aria-errormessage="time-error")(?=[^>]*aria-invalid="true")(?=[^>]*aria-controls="time-options")(?=[^>]*aria-roledescription="time selector")[^>]*>/,
        )
        expect(timeMarkup.match(/aria-controls="time-options"/g)).toHaveLength(
            2,
        )
        expect(timeMarkup).toContain('Zeit fehlt')
    })

    test('marks a required time field on its visible trigger', () => {
        const markup = renderToStaticMarkup(
            createElement(TimeInput, {
                id: 'required-time',
                label: 'Zeit',
                value: '',
                onChange: noopChange,
                required: true,
            }),
        )

        expect(markup).toContain('id="required-time"')
        expect(markup).toContain('aria-required="true"')
        expect(markup).toContain('required=""')
    })

    test('keeps native required off a time input when error is null', () => {
        const markup = renderToStaticMarkup(
            createElement(TimeInput, {
                id: 'optional-time',
                value: '',
                onChange: noopChange,
                required: true,
                error: null,
            }),
        )

        expect(markup).not.toContain('required=""')
        expect(markup).not.toContain('aria-required="true"')
    })

    test('keeps numeric labels and suppresses required ARIA on disabled fields', () => {
        const markup = renderToStaticMarkup(
            createElement(TextInput, {
                id: 'disabled-field',
                label: 0,
                value: '',
                onChange: noopChange,
                required: true,
                disabled: true,
            }),
        )

        expect(markup).toContain('id="disabled-field-label"')
        expect(markup).toContain('>0</label>')
        expect(markup).not.toContain('aria-required="true"')
    })

    test('keeps a read-only time trigger focusable while blocking its menu', () => {
        const markup = renderToStaticMarkup(
            createElement(TimeInput, {
                id: 'readonly-time',
                value: '',
                onChange: noopChange,
                readOnly: true,
            }),
        )

        expect(markup).toContain('id="readonly-time"')
        expect(markup).toContain('aria-readonly="true"')
        expect(markup).not.toContain(
            'id="readonly-time" type="button" aria-haspopup="listbox" aria-expanded="false" disabled',
        )
    })

    test('deduplicates ARIA description IDs without changing their order', () => {
        expect(
            mergeAriaDescribedBy(
                'consumer-help description',
                'description error',
                'error',
            ),
        ).toBe('consumer-help description error')
    })
})
