import { expect, test } from 'bun:test'
import { parseNumericDraft } from '../../../lib/Inputs/numeric.utils.ts'
test('parses decimal commits without coercing incomplete drafts to zero', () => {
    expect(parseNumericDraft('')).toBeNull()
    expect(parseNumericDraft('  ')).toBeNull()
    for (const value of [
        '-',
        '+',
        '.',
        '-.',
        '1e3',
        'Infinity',
        '0x10',
        '1.2.3',
        '9'.repeat(400),
    ])
        expect(parseNumericDraft(value)).toBeUndefined()
    expect(parseNumericDraft('-12.5')).toBe(-12.5)
    expect(parseNumericDraft('+1.')).toBe(1)
    expect(parseNumericDraft(',5')).toBe(0.5)
    expect(parseNumericDraft('0')).toBe(0)
})
