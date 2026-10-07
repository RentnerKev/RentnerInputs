<p align="center">
    <img src="https://raw.githubusercontent.com/RentnerKev/RentnerInputs/main/assets/readme/banner.png" alt="RentnerInputs" width="100%">
</p>

<p align="center">
    <a href="https://github.com/RentnerKev/RentnerInputs/actions/workflows/ci.yml"><img src="https://github.com/RentnerKev/RentnerInputs/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI"></a>
    <a href="https://github.com/RentnerKev/RentnerInputs/actions/workflows/codeql.yml"><img src="https://github.com/RentnerKev/RentnerInputs/actions/workflows/codeql.yml/badge.svg?branch=main" alt="CodeQL"></a>
    <a href="https://www.npmjs.com/package/@rentnerkev/inputs"><img src="https://img.shields.io/npm/v/@rentnerkev/inputs" alt="npm version"></a>
    <a href="https://www.npmjs.com/package/@rentnerkev/inputs"><img src="https://img.shields.io/npm/dm/@rentnerkev/inputs" alt="npm downloads"></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT license"></a>
</p>

Controlled React inputs with validation, character counters, formatted values and customizable Tailwind styling.

## Installation

Requires React 19, React DOM 19 and Tailwind CSS 4.

```bash
bun add @rentnerkev/inputs
# npm alternative
npm install @rentnerkev/inputs
```

Import the package styles in your Tailwind stylesheet:

```css
@import 'tailwindcss';
@import '@rentnerkev/inputs/tailwind.css';
```

## Quick start

```tsx
'use client'

import { useState } from 'react'
import { TextInput } from '@rentnerkev/inputs'

export function NameField() {
    const [value, setValue] = useState('')

    return (
        <TextInput
            label="Name"
            value={value}
            onValueChange={setValue}
            showLength
            maxLength={40}
        />
    )
}
```

## Screenshots

| Text, email and character counters                                                                                                                                                                                                                                                                             | Password strength and currency formatting                                                                                                                                                                                                                                                                                      |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [![Text, email and character counters](https://raw.githubusercontent.com/RentnerKev/RentnerInputs/main/assets/readme/screenshots/text-email-and-character-counters.png)](https://raw.githubusercontent.com/RentnerKev/RentnerInputs/main/assets/readme/screenshots/text-email-and-character-counters.png)      | [![Password strength and currency formatting](https://raw.githubusercontent.com/RentnerKev/RentnerInputs/main/assets/readme/screenshots/password-strength-and-formatted-currency.png)](https://raw.githubusercontent.com/RentnerKev/RentnerInputs/main/assets/readme/screenshots/password-strength-and-formatted-currency.png) |
| **Inline validation and number limits**                                                                                                                                                                                                                                                                        | **Time selection and OTP confirmation**                                                                                                                                                                                                                                                                                        |
| [![Inline validation and number limits](https://raw.githubusercontent.com/RentnerKev/RentnerInputs/main/assets/readme/screenshots/inline-validation-and-number-limits.png)](https://raw.githubusercontent.com/RentnerKev/RentnerInputs/main/assets/readme/screenshots/inline-validation-and-number-limits.png) | [![Time selection and OTP confirmation](https://raw.githubusercontent.com/RentnerKev/RentnerInputs/main/assets/readme/screenshots/time-selection-and-otp-confirmation.png)](https://raw.githubusercontent.com/RentnerKev/RentnerInputs/main/assets/readme/screenshots/time-selection-and-otp-confirmation.png)                 |

[Full API and usage guide](https://github.com/RentnerKev/RentnerInputs/blob/main/docs/usage.md) · [Local Playground](./playground) · [MIT license](./LICENSE)

Run the Playground from the repository root:

```bash
bun install --cwd playground
bun run playground:dev
```
