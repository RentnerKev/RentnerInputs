# @rentnerkev/inputs

Controlled React input components with labels, validation, icons, length
counters, localization, and customizable Tailwind styling.

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
- `MoneyInput`
- `PasswordInput`
- `QuantityInput`
- `TimeInput`
- `Textarea`

`CustomInput` remains available as a backward-compatible entry point and
selects the concrete component through its `type` prop.

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
                onChange={(event) => setMessage(event.target.value)}
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

## Shared field contract

| Prop           | Type                                           | Default                  | Description                                                          |
| -------------- | ---------------------------------------------- | ------------------------ | -------------------------------------------------------------------- |
| `value`        | `string`                                       | Required                 | Controlled field value.                                              |
| `onChange`     | `ChangeEventHandler`                           | Required                 | Called after internal input handling.                                |
| `label`        | `ReactNode`                                    | –                        | Accessible label above the field.                                    |
| `description`  | `ReactNode`                                    | –                        | Help text with a stable ARIA relationship.                           |
| `error`        | `string \| null`                               | –                        | External error; overrides internal errors, while `null` clears them. |
| `icon`         | `ReactNode`                                    | –                        | Icon displayed on the left.                                          |
| `triggerRef`   | `Ref<HTMLInputElement \| HTMLTextAreaElement>` | –                        | Alias ref in addition to the standard `ref`.                         |
| `showLength`   | `boolean`                                      | `false`                  | Displays the current character count.                                |
| `customDesign` | `CustomDesign`                                 | –                        | Overrides individual design classes.                                 |
| `locale`       | `InputLocale`                                  | `'de'`                   | Message language or Intl locale string.                              |
| `messages`     | `Partial<InputMessages>`                       | –                        | Overrides selected localized messages.                               |
| `className`    | `string`                                       | `w-full py-3 rounded-xl` | Classes for the actual input element.                                |

Use native `maxLength` and `minLength` props for character constraints.
`showLength` adds the visible counter.

Consumer IDs, the description ID, and the visible error ID are merged into
`aria-describedby`. An invalid native submit focuses the visible field.
`disabled` removes the field from internal validation. `readOnly` prevents
changes and internal constraint validation while retaining its value and native
attributes.

For `TimeInput`, `triggerRef` points to the visible hour trigger. The same
button ref is available through `CustomInput` when `type="time"`.

## Component-specific props

| Component       | Additional props                                                            |
| --------------- | --------------------------------------------------------------------------- |
| `NumberInput`   | `minValue`, `maxValue`                                                      |
| `MoneyInput`    | `currency` (default `EUR`), `locale` (`'de'`, `'en'`, or an Intl locale)    |
| `PasswordInput` | `showPasswordStrength`                                                      |
| `QuantityInput` | `minValue`, `maxValue`, `suffix` (default `x`)                              |
| `Textarea`      | Native textarea props such as `rows` and `wrap`; resize through `className` |

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
`focusRing`, `focusBorder`, `errorBorder`, `errorRing`, `errorText`,
`iconColor`, `iconFocus`, `counterBg`, `counterText`, `counterBorderFocus`, and
the password-strength classes.

When no `id` is provided, the component creates a stable ID so its label and
field remain accessible.

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
- `@rentnerkev/inputs/number-input`
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
