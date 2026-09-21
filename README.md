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

| Prop           | Typ                                            | Standard                 | Beschreibung                                                     |
| -------------- | ---------------------------------------------- | ------------------------ | ---------------------------------------------------------------- |
| `value`        | `string`                                       | erforderlich             | Kontrollierter Feldwert.                                         |
| `onChange`     | `ChangeEventHandler`                           | erforderlich             | Wird nach der internen Eingabeprüfung aufgerufen.                |
| `label`        | `ReactNode`                                    | –                        | Zeigt ein verknüpftes Label über dem Feld.                       |
| `description`  | `ReactNode`                                    | –                        | Hilfetext mit stabiler ID und ARIA-Verknüpfung.                  |
| `error`        | `string \| null`                               | –                        | Externer Fehler; überschreibt interne Fehler, `null` löscht sie. |
| `icon`         | `ReactNode`                                    | –                        | Icon links im Feld.                                              |
| `triggerRef`   | `Ref<HTMLInputElement \| HTMLTextAreaElement>` | –                        | Alias-Ref zusätzlich zum bestehenden `ref`.                      |
| `showLength`   | `boolean`                                      | `false`                  | Zeigt die aktuelle Zeichenanzahl.                                |
| `customDesign` | `CustomDesign`                                 | –                        | Überschreibt einzelne Designklassen.                             |
| `locale`       | `InputLocale`                                  | `'de'`                   | Sprache der Texte und optionaler Intl-Locale-String.             |
| `messages`     | `Partial<InputMessages>`                       | –                        | Überschreibt einzelne Texte der gewählten Sprache.               |
| `className`    | `string`                                       | `w-full py-3 rounded-xl` | Klassen des eigentlichen Eingabefelds.                           |

Zeichenlimits werden über die nativen Props `maxLength` und `minLength` gesteuert. Mit `showLength` lässt sich zusätzlich der Zeichenzähler einblenden.

`aria-describedby` wird aus übergebenen Consumer-IDs, der Description-ID und
der ID eines sichtbaren Fehlers zusammengeführt. Bei einem ungültigen Submit
wird das sichtbare Feld fokussiert. `disabled` nimmt das Feld aus der internen
Validierung; `readOnly` verhindert versehentliche Änderungen und interne
Constraint-Validierung, lässt aber den Wert sowie die übrigen nativen Attribute
und ARIA-Angaben bestehen.

Beim `TimeInput` zeigt `triggerRef` auf den sichtbaren Stunden-Trigger; bei
`CustomInput` ist diese Button-Ref für `type="time"` ebenfalls verfügbar.

## Typabhängige Props

| Komponente      | Zusätzliche Props                                                       |
| --------------- | ----------------------------------------------------------------------- |
| `NumberInput`   | `minValue`, `maxValue`                                                  |
| `MoneyInput`    | `currency` (Standard `EUR`), `locale` (`'de'`, `'en'` oder Intl-String) |
| `PasswordInput` | `showPasswordStrength`                                                  |
| `QuantityInput` | `minValue`, `maxValue`, `suffix` (Standard `x`)                         |
| `Textarea`      | native Textarea-Props wie `rows`, `wrap` und `resize` über `className`  |

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

Der gemeinsame Nachrichtenkatalog ist über `@rentnerkev/inputs` oder
`@rentnerkev/inputs/messages` verfügbar. Deutsche Texte bleiben der Standard;
mit `locale="en"` werden die vollständigen englischen Standardtexte verwendet.
Beliebige bestehende Intl-Locale-Strings wie `locale="en-GB"` bleiben für die
Geldformatierung erhalten; englische `en-`- oder `en_`-Varianten verwenden die
englischen Messages.
Einzelne Texte lassen sich über `messages` überschreiben:

```tsx
<EmailInput
    value={email}
    onChange={(event) => setEmail(event.target.value)}
    locale="en"
    messages={{ required: 'Please enter your email address' }}
    required
/>
```

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
