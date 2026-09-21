# @rentnerkev/inputs

Eine Sammlung kontrollierter React-Eingabekomponenten mit Labels, Validierung, Icons, Längenzähler und anpassbarem Tailwind-Design.

## Installation

Installiere das Paket mit npm oder Bun:

```bash
npm install @rentnerkev/inputs
```

## Komponenten

Jeder Feldtyp besitzt eine eigene Komponente, einen eigenen Logic-Hook und eigene Props-Typen:

- `TextInput`
- `EmailInput`
- `PhoneInput`
- `NumberInput`
- `MoneyInput`
- `PasswordInput`
- `QuantityInput`
- `Textarea`
- `TimeInput`

`CustomInput` bleibt als kompatibler Einstieg bestehen und wählt die konkrete Komponente über `type` aus.

## Empfohlene Verwendung

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
                label="E-Mail-Adresse"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onFocus={() => console.log('E-Mail-Feld fokussiert')}
                onBlur={() => console.log('E-Mail-Feld verlassen')}
                onKeyDown={(event) => {
                    if (event.key === 'Escape') emailRef.current?.blur()
                }}
                placeholder="name@beispiel.de"
                autoComplete="email"
                required
                maxLength={120}
                showLength
            />

            <Textarea
                id="message"
                label="Nachricht"
                name="message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Deine Nachricht"
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

## Verwendung über CustomInput

```tsx
import { CustomInput } from '@rentnerkev/inputs'

;<CustomInput
    type="password"
    value={password}
    onChange={(event) => setPassword(event.target.value)}
    placeholder="Passwort"
    autoComplete="current-password"
    showPasswordStrength
/>

;<CustomInput
    type="quantity"
    value={quantity}
    onChange={(event) => setQuantity(event.target.value)}
    placeholder="Menge"
    minValue={1}
    maxValue={999}
    suffix="x"
/>
```

## Native Attribute und Events

Die konkreten Input-Komponenten unterstützen alle üblichen `InputHTMLAttributes<HTMLInputElement>`. `Textarea` unterstützt alle `TextareaHTMLAttributes<HTMLTextAreaElement>`. Dazu gehören unter anderem:

- Events: `onFocus`, `onBlur`, `onInvalid`, `onInput`, `onKeyDown`, `onKeyUp`, `onClick`, `onPaste` und `onCopy`
- Formularattribute: `id`, `name`, `required`, `disabled`, `readOnly`, `form` und `autoComplete`
- Validierung: `minLength`, `maxLength`, `min`, `max`, `step` und `pattern`
- Barrierefreiheit und Metadaten: `aria-*`, `data-*`, `tabIndex` und `title`
- React-Refs über `ref`

Interne Handler und übergebene Handler werden kombiniert. Ein eigenes `onFocus` ersetzt daher nicht die interne Fokuslogik.

## Gemeinsame Props

| Prop           | Typ                  | Standard                 | Beschreibung                                      |
| -------------- | -------------------- | ------------------------ | ------------------------------------------------- |
| `value`        | `string`             | erforderlich             | Kontrollierter Feldwert.                          |
| `onChange`     | `ChangeEventHandler` | erforderlich             | Wird nach der internen Eingabeprüfung aufgerufen. |
| `label`        | `ReactNode`          | –                        | Zeigt ein verknüpftes Label über dem Feld.        |
| `icon`         | `ReactNode`          | –                        | Icon links im Feld.                               |
| `showLength`   | `boolean`            | `false`                  | Zeigt die aktuelle Zeichenanzahl.                 |
| `customDesign` | `CustomDesign`       | –                        | Überschreibt einzelne Designklassen.              |
| `className`    | `string`             | `w-full py-3 rounded-xl` | Klassen des eigentlichen Eingabefelds.            |

Zeichenlimits werden über die nativen Props `maxLength` und `minLength` gesteuert. Mit `showLength` lässt sich zusätzlich der Zeichenzähler einblenden.

## Typabhängige Props

| Komponente      | Zusätzliche Props                                                      |
| --------------- | ---------------------------------------------------------------------- |
| `NumberInput`   | `minValue`, `maxValue`                                                 |
| `MoneyInput`    | `currency` (Standard `EUR`), `locale` (Standard `de-DE`)               |
| `PasswordInput` | `showPasswordStrength`                                                 |
| `QuantityInput` | `minValue`, `maxValue`, `suffix` (Standard `x`)                        |
| `Textarea`      | native Textarea-Props wie `rows`, `wrap` und `resize` über `className` |

## Exporte

Alle Komponenten und Props-Typen sind über den Paketeinstieg verfügbar:

```tsx
import {
    MoneyInput,
    type MoneyInputProps,
    type CustomDesign,
} from '@rentnerkev/inputs'
```

Zusätzlich stehen direkte Subpath-Exporte wie `@rentnerkev/inputs/money-input` und `@rentnerkev/inputs/textarea` zur Verfügung.

## Design anpassen

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

`CustomDesign` unterstützt `bg`, `border`, `text`, `labelText`, `placeholder`, `focusRing`, `focusBorder`, `errorBorder`, `errorRing`, `errorText`, `iconColor`, `iconFocus`, `counterBg`, `counterText`, `counterBorderFocus` sowie die Klassen der Passwortstärke-Anzeige.

Ist keine `id` gesetzt, erzeugt die Komponente automatisch eine stabile ID, damit `label` und Eingabefeld auch barrierefrei miteinander verknüpft sind.

## CSS-Integration

Da die Bibliothek Tailwind CSS verwendet, muss das Paket als Quelle eingebunden werden:

```css
@import 'tailwindcss';
@source "../node_modules/@rentnerkev/inputs";
```

## Entwicklung

```bash
bun install
bun run verify
bun run playground:dev
```

`bun run verify` prüft Typen, Oxlint, Oxfmt, den Paket-Build und den
veröffentlichten Paketinhalt per Dry Run.
