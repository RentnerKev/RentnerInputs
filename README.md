# @rentnerkev/inputs

Controlled React input components with labels, validation, icons, length
counters, localization, and customizable Tailwind styling.

## Requirements

Use React 19 with React DOM 19, an ESM-capable build, and Tailwind CSS 4 for
the documented styling. Import this package's `tailwind.css` entry into your
Tailwind stylesheet. It uses `@source` for published classes and `@theme` for
global tokens such as `--color-primary`. Check for token name collisions with
your app and override them in a later `@theme` block if needed.

In a React Server Components app, import and render interactive inputs from a
module beginning with `'use client'`; define their state and callbacks there.
See the [Tailwind directives](https://tailwindcss.com/docs/functions-and-directives)
and [React client boundary](https://react.dev/reference/rsc/use-client) guides.

## Installation

With npm:

```bash
npm install @rentnerkev/inputs
```

Or with Bun:

```bash
bun add @rentnerkev/inputs
```

## Components

Each field type has a dedicated component, logic hook, and props type:

- `TextInput`
- `EmailInput`
- `PhoneInput`
- `NumberInput`
- `OtpInput` (digit and one-time-code fields)
- `MoneyInput`
- `PasswordInput`
- `QuantityInput`
- `TimeInput`
- `Textarea`
- `SearchInput` and `NativeTimeInput` (native search and time controls)
- `CheckboxInput`, `RadioInput`, `RangeInput`, and `FileInput` (native semantics)

`CustomInput` remains available as a backward-compatible entry point and
selects the concrete component through its `type` prop. It also accepts
`type="search"` and `type="native-time"`.

## Project-wide defaults

Wrap the app once with `InputProvider` to set locale, messages, visual classes,
and validation behavior centrally. Nested providers inherit settings and can
override only the relevant values, such as the authenticated user's locale.

```tsx
import { InputProvider } from '@rentnerkev/inputs'

;<InputProvider
    locale="en"
    validationMode="external"
    customDesign={{
        bg: 'bg-app-field',
        border: 'border-app-border',
        text: 'text-app-ink',
        focusBorder: 'focus:border-app-accent',
    }}
    classNames={{
        input: 'h-12 w-full rounded-xl text-sm',
        textarea: 'w-full rounded-xl text-sm',
        checkbox: 'size-4 accent-app-accent',
    }}
>
    <YourApp />
</InputProvider>
```

`validationMode="external"` leaves validation messages to a form library while
preserving native attributes, events, and explicit `error` or `aria-invalid`
props. The default `"built-in"` mode retains the package's own validation.
Each field can override the provider's locale, messages, design, classes, or
validation mode as needed. The package includes German, English, Spanish, and
French messages; other locales continue to fall back to German.

## Quick start

```tsx
import { useRef, useState } from 'react'
import { EmailInput, Textarea } from '@rentnerkev/inputs'

export function ContactForm() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const emailRef = useRef<HTMLInputElement>(null)

    return (
        <form>
            <EmailInput
                ref={emailRef}
                id="email"
                label="Email address"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === 'Escape') emailRef.current?.blur()
                }}
                placeholder="name@example.com"
                autoComplete="email"
                required
                maxLength={120}
                showLength
            />

            <Textarea
                id="message"
                label="Message"
                name="message"
                value={message}
                onValueChange={setMessage}
                placeholder="Your message"
                rows={6}
                minLength={10}
                maxLength={500}
                showLength
                required
            />
        </form>
    )
}
```

## `CustomInput`

Use `CustomInput` when the field type is selected dynamically or when migrating
from an earlier package version.

```tsx
import { CustomInput } from '@rentnerkev/inputs'

;<CustomInput
    type="password"
    value={password}
    onChange={(event) => setPassword(event.target.value)}
    placeholder="Password"
    autoComplete="current-password"
    showPasswordStrength
/>

;<CustomInput
    type="quantity"
    value={quantity}
    onChange={(event) => setQuantity(event.target.value)}
    placeholder="Quantity"
    minValue={1}
    maxValue={999}
    suffix="x"
/>

;<CustomInput
    type="textarea"
    value={message}
    onValueChange={setMessage}
    placeholder="Message"
    rows={4}
/>
```

## Native attributes and events

The concrete input components support the usual
`InputHTMLAttributes<HTMLInputElement>`. `Textarea` supports
`TextareaHTMLAttributes<HTMLTextAreaElement>`, including:

- events such as `onFocus`, `onBlur`, `onInvalid`, `onInput`, `onKeyDown`,
  `onKeyUp`, `onClick`, `onPaste`, and `onCopy`;
- form attributes such as `id`, `name`, `required`, `disabled`, `readOnly`,
  `form`, and `autoComplete`;
- constraints such as `minLength`, `maxLength`, `min`, `max`, `step`, and
  `pattern`;
- accessibility and metadata attributes such as `aria-*`, `data-*`,
  `tabIndex`, and `title`;
- React refs through `ref`.

Internal and consumer event handlers are composed. A custom `onFocus`, for
example, does not replace the package's focus handling.

`TextInput` and `Textarea` also support `onValueChange`, which receives the
next string value directly. Use it with a state setter when you do not need the
native change event:

```tsx
<TextInput value={name} onValueChange={setName} />
<Textarea value={message} onValueChange={setMessage} />
```

`onChange` remains available for native event access. When both callbacks are
provided, internal validation runs first, then `onChange` receives the native
event and `onValueChange` receives the accepted string.

## Shared field contract

| Prop            | Type                                           | Default                  | Description                                                            |
| --------------- | ---------------------------------------------- | ------------------------ | ---------------------------------------------------------------------- |
| `value`         | `string`                                       | Required                 | Controlled field value.                                                |
| `onChange`      | `ChangeEventHandler`                           | –                        | Receives the native event after internal input handling.               |
| `onValueChange` | `(value: string) => void`                      | –                        | Receives the accepted string value directly on `TextInput`/`Textarea`. |
| `label`         | `ReactNode`                                    | –                        | Accessible label above the field.                                      |
| `description`   | `ReactNode`                                    | –                        | Help text with a stable ARIA relationship.                             |
| `error`         | `string \| null`                               | –                        | External error; overrides internal errors, while `null` clears them.   |
| `icon`          | `ReactNode`                                    | –                        | Icon displayed on the left.                                            |
| `triggerRef`    | `Ref<HTMLInputElement \| HTMLTextAreaElement>` | –                        | Alias ref in addition to the standard `ref`.                           |
| `showLength`    | `boolean`                                      | `false`                  | Displays the current character count.                                  |
| `customDesign`  | `CustomDesign`                                 | –                        | Overrides individual design classes.                                   |
| `locale`        | `InputLocale`                                  | `'de'`                   | Message language or Intl locale string.                                |
| `messages`      | `Partial<InputMessages>`                       | –                        | Overrides selected localized messages.                                 |
| `className`     | `string`                                       | `w-full py-3 rounded-xl` | Classes for the actual input element.                                  |

For `TextInput` and `Textarea`, provide `onChange`, `onValueChange`, or both.

Use native `maxLength` and `minLength` props for character constraints.
`showLength` adds the visible counter.

For `NumberInput`, `min` and `max` control both the native attributes and built-in validation. `minValue` and `maxValue` remain supported as aliases. If both forms are supplied, the native `min` or `max` value takes precedence.

Consumer IDs, the description ID, and the visible error ID are merged into
`aria-describedby`. An invalid native submit focuses the visible field.
`disabled` removes the field from internal validation. `readOnly` prevents
changes and internal constraint validation while retaining its value and native
attributes.

For `TimeInput`, `triggerRef` points to the visible hour trigger. The same
button ref is available through `CustomInput` when `type="time"`.

## Component-specific props

| Component       | Additional props                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| `NumberInput`   | `min`, `max`; `minValue`, `maxValue` aliases                                                                       |
| `OtpInput`      | `length` (default `6`), `onComplete`, `status`, `animated`, `showProgress`, `feedbackClassNames`, `inputClassName` |
| `MoneyInput`    | `currency` (default `EUR`), `locale` (`'de'`, `'en'`, or an Intl locale)                                           |
| `PasswordInput` | `showPasswordStrength`                                                                                             |
| `QuantityInput` | `minValue`, `maxValue`, `suffix` (default `x`)                                                                     |
| `Textarea`      | Native textarea props such as `rows` and `wrap`; resize through `className`                                        |

`MoneyInput` interprets decimal and grouping separators using its `locale` (or
the surrounding `InputProvider` locale). For example, use `"1234.56"` with
`locale="en"` and `"1234,56"` with `locale="de"`. The controlled value remains
the editable string; currency formatting appears when the field is unfocused.

### One-time codes

`OtpInput` keeps each digit in a controlled array, so editing one position preserves the others. It supports typing, arrow keys, Backspace, pasting a complete or partial code, and browser one-time-code autofill. `onComplete` receives the joined code when all positions are filled. With `name`, the joined value is submitted as one form field.

```tsx
import { useRef, useState } from 'react'
import { OtpInput } from '@rentnerkev/inputs'

function LoginCode({
    checkCode,
}: {
    checkCode: (code: string) => Promise<boolean>
}) {
    const [digits, setDigits] = useState<Array<string>>(Array(6).fill(''))
    const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle')
    const currentCode = useRef('')

    async function verify(code: string) {
        setStatus('idle')
        const valid = await checkCode(code)
        if (currentCode.current === code) {
            setStatus(valid ? 'success' : 'error')
        }
    }

    return (
        <OtpInput
            name="code"
            label="Bestätigungscode"
            value={digits}
            onValueChange={(nextDigits) => {
                currentCode.current = nextDigits.join('')
                setDigits(nextDigits)
                setStatus('idle')
            }}
            onComplete={verify}
            status={status}
            required
        />
    )
}
```

`status="error"` briefly shakes the digits and shows a localized error; `status="success"` turns a complete code green and announces confirmation. Completion alone never marks a code as valid. Editing the code should reset the status to `"idle"`. The progress rail and focus lift are enabled by default. Set `animated={false}` to remove motion or `showProgress={false}` to hide the rail. Motion also respects `prefers-reduced-motion`.

`feedbackClassNames` replaces the default Tailwind classes for `focus`, `filled`, `error`, `success`, `progressTrack`, `progressFilled`, `progressError`, `progressSuccess`, `errorAnimation`, `successAnimation`, `errorMessage`, and `successMessage`. For example, `feedbackClassNames={{ success: 'border-lime-400 bg-lime-400/10 text-lime-200 focus:ring-lime-400/50', successAnimation: 'motion-safe:animate-pulse', successMessage: 'text-lime-300' }}` changes the confirmation style. Use the `messages` prop or `InputProvider` to override `otpInvalid` and `otpVerified`. Import `@rentnerkev/inputs/tailwind.css` to include the default animation utilities.

The first digit can be focused through `ref` or `triggerRef`. Use `className` for the outer field and `inputClassName` or `InputProvider`'s `classNames.otp` for all digit fields.

## Localization and messages

German remains the default for backward compatibility. Set `locale="en"` for
the complete English validation and ARIA messages. Existing Intl locale strings
such as `en-GB` remain available to `MoneyInput`; `en-` and `en_` variants use
the English message catalog.

```tsx
<EmailInput
    value={email}
    onChange={(event) => setEmail(event.target.value)}
    locale="en"
    messages={{ required: 'Please enter your email address' }}
    required
/>
```

The typed catalog is available from the root entry and
`@rentnerkev/inputs/messages`.

## Custom design

```tsx
<EmailInput
    value={email}
    onChange={(event) => setEmail(event.target.value)}
    customDesign={{
        labelText: 'text-blue-200',
        focusRing: 'focus:ring-blue-500/50',
        focusBorder: 'focus:border-blue-500',
        iconFocus: 'group-focus-within:text-blue-500',
    }}
/>
```

`CustomDesign` supports `bg`, `border`, `text`, `labelText`, `placeholder`,
`focusRing`, `focusBorder`, `errorBorder`, `errorRing`, `errorRingBase`, `errorText`,
`iconColor`, `iconFocus`, `counterBg`, `counterText`, `counterBorderFocus`, and
the password-strength classes.
`errorRing` styles a focused invalid input; `errorRingBase` styles the outer
`TimeInput` ring while its required error is visible.

When no `id` is provided, the component creates a stable ID so its label and
field remain accessible.

The native checkbox, radio, range, and file controls forward all native input
attributes and refs. They are available when a field should retain browser
behavior, including unchecked radio values and uncontrolled file selection.

## Tailwind CSS

Import the package entry after Tailwind CSS in your main stylesheet:

```css
@import 'tailwindcss';
@import '@rentnerkev/inputs/tailwind.css';
```

The entry scans only published JavaScript under `dist`. It provides the shared
`primary`, `primary-hover`, `background-dark`, `surface-dark`, `input-dark`,
`border-dark`, `secondary-text`, and `muted-foreground` theme tokens. Override
them with a later `@theme` block when needed.

## Public entry points

All components and prop types are exported from `@rentnerkev/inputs`. Direct
component entry points are also available:

- `@rentnerkev/inputs/input`
- `@rentnerkev/inputs/text-input`
- `@rentnerkev/inputs/search-input`
- `@rentnerkev/inputs/native-time-input`
- `@rentnerkev/inputs/checkbox-input`
- `@rentnerkev/inputs/radio-input`
- `@rentnerkev/inputs/range-input`
- `@rentnerkev/inputs/file-input`
- `@rentnerkev/inputs/number-input`
- `@rentnerkev/inputs/otp-input`
- `@rentnerkev/inputs/phone-input`
- `@rentnerkev/inputs/email-input`
- `@rentnerkev/inputs/money-input`
- `@rentnerkev/inputs/password-input`
- `@rentnerkev/inputs/quantity-input`
- `@rentnerkev/inputs/time-input`
- `@rentnerkev/inputs/textarea`
- `@rentnerkev/inputs/types`
- `@rentnerkev/inputs/messages`
- `@rentnerkev/inputs/tailwind.css`

## Development

```bash
bun install --frozen-lockfile
bun install --cwd playground --frozen-lockfile
bun run verify
bun run playground:build
```

`bun run verify` checks types, Oxlint, Oxfmt, tests, the package build, and the
published package contents.

## License

MIT
