import { expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { InputProvider } from '../shared/Inputs/Components/InputProvider.tsx'
import { TextInput } from '../shared/Inputs/Components/Inputs/TextInput.tsx'
import { Textarea } from '../shared/Inputs/Components/Inputs/Textarea.tsx'
test('replaces visual shell blocks while preserving functional classes and provider inheritance', () => {
    const markup = renderToStaticMarkup(
        <InputProvider
            controlSize="sm"
            classNames={{
                root: 'root-slot',
                label: 'provider-label',
                control: 'control-slot',
                description: 'description-slot',
                error: 'error-slot',
            }}
        >
            <TextInput
                label="Label"
                description="Description"
                error="Error"
                value=""
                onValueChange={() => undefined}
                controlSize="lg"
                classNames={{ label: 'local-label' }}
            />
            <Textarea value="" onValueChange={() => undefined} />
        </InputProvider>,
    )
    expect(markup).toContain('local-label')
    expect(markup).toContain('h-rentner-control-lg')
    expect(markup).toContain('h-rentner-control-sm')
    expect(markup).toContain('root-slot')
    expect(markup).toContain('control-slot')
    expect(markup).toContain('description-slot')
    expect(markup).toContain('error-slot')
    expect(markup).not.toContain('bg-rentner-control')
    expect(markup).not.toContain('controlSize=')
    expect(markup).not.toContain('classNames=')
})

test('lets replacement control slots own padding without icons or counters', () => {
    for (const control of [
        <TextInput
            key="text"
            value=""
            onValueChange={() => undefined}
            classNames={{ control: 'p-0' }}
        />,
        <Textarea
            key="textarea"
            value=""
            onValueChange={() => undefined}
            classNames={{ control: 'p-0' }}
        />,
    ]) {
        const markup = renderToStaticMarkup(control)
        expect(markup).not.toContain('padding-left')
        expect(markup).not.toContain('padding-right')
    }
})
