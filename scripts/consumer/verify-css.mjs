import assert from 'node:assert/strict'
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

export function verifyCss({ consumerRoot, manifest, runNode, vite }) {
    const entries = {
        full: 'tailwind.css',
        input: 'input.css',
        text: 'text-input.css',
    }
    for (const [name, entry] of Object.entries(entries)) {
        writeFileSync(
            join(consumerRoot, `scope-${name}.css`),
            `@import 'tailwindcss' source(none);\n@import '${manifest.name}/${entry}';\n`,
        )
        writeFileSync(
            join(consumerRoot, `scope-${name}.html`),
            `<!doctype html><html><head><link rel="stylesheet" href="/scope-${name}.css"></head><body>Scoped CSS consumer</body></html>`,
        )
    }
    writeFileSync(
        join(consumerRoot, 'scope.config.mjs'),
        `
        import tailwindcss from '@tailwindcss/vite'
        export default {
            plugins: [tailwindcss()],
            build: { outDir: 'scope-output', rolldownOptions: { input: ['scope-full.html', 'scope-input.html', 'scope-text.html'] } },
        }
    `,
    )
    runNode([
        vite,
        'build',
        '--config',
        'scope.config.mjs',
        '--logLevel',
        'error',
    ])
    const assets = join(consumerRoot, 'scope-output/assets')
    const cssFor = (name) => {
        const path = readdirSync(assets).find(
            (file) =>
                file.startsWith(`scope-${name}-`) && file.endsWith('.css'),
        )
        assert.ok(path, `Missing compiled scoped CSS: ${name}`)
        return readFileSync(join(assets, path), 'utf8')
    }
    const full = cssFor('full'),
        input = cssFor('input'),
        text = cssFor('text')
    for (const css of [full, input, text]) {
        assert.ok(
            css.includes('.bg-input-dark'),
            'Shared field background must be generated',
        )
        assert.ok(
            css.includes('.border-red-500'),
            'Error styles must be generated',
        )
        assert.ok(
            css.includes('.pl-11'),
            'Leading icon spacing must be generated',
        )
    }
    assert.ok(
        full.includes('.accent-primary'),
        'Full entry must cover primitive controls',
    )
    assert.ok(
        full.includes('animate-otp-shake'),
        'Full entry must cover OTP animation',
    )
    assert.ok(input.includes('.min-h-28'), 'CustomInput must cover textarea')
    assert.ok(
        !text.includes('.min-h-28'),
        'TextInput should exclude textarea layout',
    )
    for (const css of [input, text]) {
        assert.ok(
            !css.includes('.accent-primary'),
            'Scoped entries should exclude primitive controls',
        )
        assert.ok(
            !css.includes('animate-otp-shake'),
            'Scoped entries should exclude OTP animation usage',
        )
    }
    console.log('Packed CSS consumers passed: full, CustomInput, TextInput')
}
