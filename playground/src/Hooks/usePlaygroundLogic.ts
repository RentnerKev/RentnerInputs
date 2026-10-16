import { useCallback, useState } from 'react'
import type { FormEvent } from 'react'
import type { PlaygroundLogicResult } from '../Types/Playground.types.ts'
export function usePlaygroundLogic(): PlaygroundLogicResult {
    const [shadowPortalContainer, setShadowPortalContainer] =
        useState<ShadowRoot | null>(null)
    const setShadowHost = useCallback((node: HTMLDivElement | null) => {
        if (node)
            setShadowPortalContainer(
                node.shadowRoot ?? node.attachShadow({ mode: 'open' }),
            )
    }, [])
    const portalContainer = new URLSearchParams(window.location.search).has(
        'shadow-portal',
    )
        ? shadowPortalContainer
        : new URLSearchParams(window.location.search).has('custom-portal')
          ? document.getElementById('root')
          : undefined
    const readOnlyTime = new URLSearchParams(window.location.search).has(
        'readonly-time',
    )
    const [timeBlurs, setTimeBlurs] = useState(0)
    function handleTimeBlur(
        event: import('react').FocusEvent<HTMLInputElement>,
    ) {
        event.preventDefault()
        event.stopPropagation()
        setTimeBlurs((value) => value + 1)
    }
    const [numericValue, setNumericValue] = useState<number | null>(null)
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
        refs: { setShadowHost },
        state: {
            timeBlurs,
            portalContainer,
            numericValue,
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
            setNumericValue,
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
            handleTimeBlur,
            handleSubmit,
            handleOtpChange,
            handleOtpError,
            handleOtpSuccess,
            handleOtpReset,
        },
    }
}
