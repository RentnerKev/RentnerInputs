import { useState } from 'react'
import type { FormEvent } from 'react'
import type { PlaygroundLogicResult } from '../Types/Playground.types.ts'
export function usePlaygroundLogic(): PlaygroundLogicResult {
    const readOnlyTime = new URLSearchParams(window.location.search).has(
        'readonly-time',
    )
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [amount, setAmount] = useState('')
    const [limitedAmount, setLimitedAmount] = useState('')
    const [username, setUsername] = useState('')
    const [money, setMoney] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [appointmentTime, setAppointmentTime] = useState(
        readOnlyTime ? '09:30' : '',
    )
    const [otpDigits, setOtpDigits] = useState<Array<string>>(Array(6).fill(''))
    const [otpStatus, setOtpStatus] = useState<'idle' | 'error' | 'success'>(
        'idle',
    )

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
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

    function handleOtpChange(nextDigits: string[]) {
        setOtpDigits(nextDigits)
        setOtpStatus('idle')
    }
    function handleOtpError() {
        setOtpStatus('error')
    }
    function handleOtpSuccess() {
        setOtpStatus('success')
    }
    function handleOtpReset() {
        setOtpStatus('idle')
    }
    return {
        state: {
            readOnlyTime,
            email,
            phone,
            amount,
            limitedAmount,
            username,
            money,
            password,
            message,
            appointmentTime,
            otpDigits,
            otpStatus,
        },
        setter: {
            setEmail,
            setPhone,
            setAmount,
            setLimitedAmount,
            setUsername,
            setMoney,
            setPassword,
            setMessage,
            setAppointmentTime,
            setOtpDigits,
            setOtpStatus,
        },
        handler: {
            handleSubmit,
            handleOtpChange,
            handleOtpError,
            handleOtpSuccess,
            handleOtpReset,
        },
    }
}
