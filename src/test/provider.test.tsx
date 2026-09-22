import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { InputProvider } from '../InputProvider.js'
import { TextInput } from '../Components/Inputs/TextInput.js'
import { PasswordInput } from '../Components/Inputs/PasswordInput.js'
import {
    CheckboxInput,
    FileInput,
    RadioInput,
    RangeInput,
} from '../Components/Inputs/PrimitiveInputs.js'
import { SearchInput } from '../Components/Inputs/SearchInput.js'
import { NativeTimeInput } from '../Components/Inputs/NativeTimeInput.js'

const noopChange = () => undefined

describe('project-level input defaults', () => {
    test('applies design and localized password labels without per-field wrappers', () => {
        const markup = renderToStaticMarkup(
            <InputProvider
                locale="es"
                validationMode="external"
                customDesign={{
                    bg: 'bg-project-field',
                    text: 'text-project-ink',
                }}
                classNames={{ input: 'h-12 rounded-project' }}
            >
                <TextInput value="" onChange={noopChange} required />
                <PasswordInput
                    id="password"
                    value="secret"
                    onChange={noopChange}
                />
            </InputProvider>,
        )

        expect(markup).toContain('bg-project-field')
        expect(markup).toContain('text-project-ink')
        expect(markup).toContain('h-12 rounded-project')
        expect(markup).toContain('aria-label="Mostrar contraseña"')
        expect(markup).toContain('aria-controls="password"')
        expect(markup).toContain('aria-pressed="false"')
        expect(markup).not.toContain('Este campo es obligatorio')
    })

    test('nested providers inherit design while overriding locale', () => {
        const markup = renderToStaticMarkup(
            <InputProvider
                locale="en"
                customDesign={{ bg: 'bg-project-field' }}
            >
                <InputProvider locale="fr">
                    <PasswordInput value="secret" onChange={noopChange} />
                </InputProvider>
            </InputProvider>,
        )

        expect(markup).toContain('bg-project-field')
        expect(markup).toContain('aria-label="Afficher le mot de passe"')
    })

    test('renders native controls with their native semantics', () => {
        const markup = renderToStaticMarkup(
            <InputProvider
                classNames={{
                    checkbox: 'project-checkbox',
                    radio: 'project-radio',
                    range: 'project-range',
                    file: 'project-file',
                }}
            >
                <CheckboxInput checked onChange={noopChange} />
                <RadioInput
                    name="choice"
                    value="yes"
                    checked
                    onChange={noopChange}
                />
                <RangeInput min={1} max={3} value={2} onChange={noopChange} />
                <FileInput accept="image/png" onChange={noopChange} />
                <SearchInput value="test" onChange={noopChange} />
                <NativeTimeInput value="12:30" onChange={noopChange} />
            </InputProvider>,
        )

        expect(markup).toContain('type="checkbox"')
        expect(markup).toContain('project-checkbox')
        expect(markup).toContain('type="radio"')
        expect(markup).toContain('project-radio')
        expect(markup).toContain('type="range"')
        expect(markup).toContain('project-range')
        expect(markup).toContain('type="file"')
        expect(markup).toContain('project-file')
        expect(markup).toContain('type="search"')
        expect(markup).toContain('type="time"')
    })
})
