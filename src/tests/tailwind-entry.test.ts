import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

type PackageManifest = {
    exports: Record<string, unknown>
    files: string[]
    sideEffects: string[]
}

const repositoryRoot = resolve(import.meta.dir, '../..')
const manifest = JSON.parse(
    readFileSync(resolve(repositoryRoot, 'package.json'), 'utf8'),
) as PackageManifest
const theme = readFileSync(resolve(repositoryRoot, 'styles/theme.css'), 'utf8')
const tailwindEntry = readFileSync(
    resolve(repositoryRoot, 'tailwind.css'),
    'utf8',
)

describe('Tailwind package contract', () => {
    test('publishes scoped CSS from reachable modules while retaining the full entry', () => {
        expect(manifest.files).toContain('styles')
        for (const name of ['input', 'text-input']) {
            expect(manifest.exports[`./${name}.css`]).toBe(
                `./styles/${name}.css`,
            )
            const css = readFileSync(
                resolve(repositoryRoot, `styles/${name}.css`),
                'utf8',
            )
            expect(css).toContain("@import './theme.css'")
            expect(css).toContain('@rentnerkev/tooltips/tailwind.css')
            expect(css).toContain(
                '../dist/shared/Inputs/Components/Inputs/ErrorTooltip.js',
            )
            expect(css).not.toContain('**')
            expect(css).not.toContain('PrimitiveInputs.js')
            expect(css).not.toContain('OtpInput.js')
        }
        const text = readFileSync(
            resolve(repositoryRoot, 'styles/text-input.css'),
            'utf8',
        )
        expect(text).not.toContain('/TimeInput.js')
        expect(text).not.toContain('/Textarea.js')
        const input = readFileSync(
            resolve(repositoryRoot, 'styles/input.css'),
            'utf8',
        )
        expect(input).toContain('/TimeInput.js')
        expect(input).toContain('/Textarea.js')
        expect(tailwindEntry).toContain('./dist/**/*.js')
        expect(theme).toContain('--animate-otp-shake')
    })
    test('publishes an explicit CSS entry', () => {
        expect(manifest.exports['./tailwind.css']).toBe('./tailwind.css')
        expect(manifest.files).toContain('tailwind.css')
        expect(manifest.sideEffects).toEqual([
            './tailwind.css',
            './styles/*.css',
        ])
    })

    test('scans only built JavaScript and provides the shared theme tokens', () => {
        const sources = [
            ...tailwindEntry.matchAll(/@source\s+["']([^"']+)["']/g),
        ].map(([, source]) => source)

        expect(sources).toEqual(['./dist/**/*.js'])
        expect(tailwindEntry).not.toContain('../')

        for (const token of [
            '--color-primary',
            '--color-primary-hover',
            '--color-background-dark',
            '--color-surface-dark',
            '--color-input-dark',
            '--color-border-dark',
            '--color-secondary-text',
            '--color-muted-foreground',
        ]) {
            expect(theme).toContain(token)
        }
    })
})
