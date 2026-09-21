import React, { useState } from 'react'
import { CustomInput } from '../../src'
import {
    MailIcon,
    Hash,
    Type,
    Send,
    Banknote,
    Lock,
    MessageSquareText,
    Clock,
} from 'lucide-react'

export function App() {
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [amount, setAmount] = useState('')
    const [limitedAmount, setLimitedAmount] = useState('')
    const [username, setUsername] = useState('')
    const [money, setMoney] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [appointmentTime, setAppointmentTime] = useState('')

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault()
        const data = {
            email,
            phone,
            amount,
            limitedAmount,
            username,
            money,
            password,
            message,
            appointmentTime,
        }
        alert(
            'Daten erfolgreich an das Backend gesendet:\n' +
                JSON.stringify(data, null, 2),
        )
    }

    return (
        <main className="relative min-h-screen p-6 md:p-10">
            <div className="glow-effect left-[20%] top-[20%]" />
            <div className="glow-effect glow-effect-small left-[70%] top-[60%]" />

            <div className="relative z-10 mx-auto flex min-h-[80vh] max-w-4xl flex-col items-center justify-center gap-6">
                <h1 className="text-2xl font-semibold text-white md:text-3xl">
                    RentnerInputs Playground
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md mt-10 space-y-6"
                >
                    <CustomInput
                        label="Text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        placeholder="Benutzername (Text)"
                        required
                        showLength={true}
                        minLength={3}
                        maxLength={20}
                        icon={<Type className="h-5 w-5" />}
                        className="w-full py-4 rounded-md"
                        customDesign={{
                            focusRing: 'focus:ring-blue-500/50',
                            focusBorder: 'focus:border-blue-500',
                            iconFocus: 'group-focus-within:text-blue-500',
                        }}
                    />

                    <CustomInput
                        label="E-Mail-Adresse"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="E-Mail Adresse"
                        required
                        showLength={true}
                        maxLength={100}
                        type="email"
                        icon={<MailIcon className="h-5 w-5" />}
                    />

                    <CustomInput
                        label="Passwort"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Passwort"
                        required
                        showLength={true}
                        minLength={8}
                        maxLength={132}
                        type="password"
                        icon={<Lock className="h-5 w-5" />}
                        showPasswordStrength={true}
                    />

                    <CustomInput
                        label="Telefonnummer"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        placeholder="Telefonnummer"
                        showLength={true}
                        maxLength={200}
                        type="phone"
                    />

                    <CustomInput
                        label="Nachricht"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        placeholder="Nachricht (Textarea)"
                        required
                        showLength={true}
                        minLength={10}
                        maxLength={240}
                        type="textarea"
                        rows={5}
                        icon={<MessageSquareText className="h-5 w-5" />}
                        className="w-full py-4 rounded-md"
                    />

                    <CustomInput
                        label="Uhrzeit"
                        value={appointmentTime}
                        onChange={(event) =>
                            setAppointmentTime(event.target.value)
                        }
                        placeholder="Uhrzeit"
                        required
                        type="time"
                        minuteStep={5}
                        icon={<Clock className="h-5 w-5" />}
                        className="w-70 py-4 rounded-md"
                    />

                    <CustomInput
                        label="Betrag"
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                        placeholder="Betrag (Zahl)"
                        required
                        showLength={true}
                        maxLength={8}
                        type="number"
                        icon={<Hash className="h-5 w-5" />}
                    />

                    <CustomInput
                        label="Begrenzter Betrag"
                        value={limitedAmount}
                        onChange={(event) =>
                            setLimitedAmount(event.target.value)
                        }
                        placeholder="Limit-Test (min. 5, max. 50)"
                        required
                        showLength={true}
                        maxLength={2}
                        minValue={5}
                        maxValue={50}
                        type="number"
                        icon={<Hash className="h-5 w-5" />}
                    />

                    <CustomInput
                        label="Geldbetrag"
                        value={money}
                        onChange={(event) => setMoney(event.target.value)}
                        placeholder="Umsatz (Geld)"
                        required
                        type="money"
                        icon={<Banknote className="h-5 w-5" />}
                    />

                    <button
                        type="submit"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-background-dark transition-all hover:bg-primary-hover active:scale-[0.98]"
                    >
                        <Send className="h-5 w-5" />
                        Daten absenden
                    </button>
                </form>
            </div>
        </main>
    )
}
