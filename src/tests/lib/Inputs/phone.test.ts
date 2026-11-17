import { expect, test } from 'bun:test'
import { validatePhone } from '../../../lib/Inputs/inputValidation.utils.ts'
import { inputMessageCatalog } from '../../../lib/Inputs/messages.ts'

test('accepts international phone formatting without country or length restrictions', () => {
    for (const value of [
        '',
        '1',
        '+49 30 123456',
        '+49 (0) 30 123456',
        '(030) 123-45',
        '+1 (212) 555-0100',
        '0049 30/123.456',
        '+33 1 23 45 67 89',
    ]) {
        expect(validatePhone(value, inputMessageCatalog.en)).toBeNull()
    }
})

test('rejects repeated or misplaced plus signs, unbalanced parentheses and nondigit phone input', () => {
    for (const value of [
        '++49 123',
        '+++1',
        '49+123',
        '+(49 123',
        '(030 123',
        '030) 123',
        ')(123)',
        '+49 (30)) 123',
        '+49 ((30) 123',
        '+',
        '()',
        'hello',
        '123 ext 4',
    ]) {
        expect(validatePhone(value, inputMessageCatalog.en)).toBe(
            'Invalid phone number',
        )
    }
})
