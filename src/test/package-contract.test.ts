import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'

interface PackageContract {
    version: string
    exports: Record<string, unknown>
    peerDependencies: Record<string, string>
    scripts: Record<string, string>
}

const packageJson = JSON.parse(
    readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
) as PackageContract
const readme = readFileSync(new URL('../../README.md', import.meta.url), 'utf8')

describe('published package contract', () => {
    test('keeps the shared React and test contracts', () => {
        expect(packageJson.version).toBe('2.4.0')
        expect(packageJson.peerDependencies.react).toBe('^19.0.0')
        expect(packageJson.peerDependencies['react-dom']).toBe('^19.0.0')
        expect(packageJson.scripts.test).toBe('bun test')
    })

    test('publishes every documented entry point', () => {
        expect(Object.keys(packageJson.exports)).toContainAllValues([
            '.',
            './tailwind.css',
            './input',
            './text-input',
            './search-input',
            './native-time-input',
            './checkbox-input',
            './radio-input',
            './range-input',
            './file-input',
            './number-input',
            './otp-input',
            './phone-input',
            './email-input',
            './money-input',
            './password-input',
            './quantity-input',
            './time-input',
            './textarea',
            './types',
            './messages',
            './package.json',
        ])
    })

    test('documents npm before Bun installation', () => {
        const npmInstallPosition = readme.indexOf(
            'npm install @rentnerkev/inputs',
        )
        const bunInstallPosition = readme.indexOf('bun add @rentnerkev/inputs')

        expect(npmInstallPosition).toBeGreaterThan(-1)
        expect(bunInstallPosition).toBeGreaterThan(npmInstallPosition)
    })
})
