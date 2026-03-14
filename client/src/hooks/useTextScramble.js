import { useEffect, useState } from 'react'

const CHARS = 'アイウエオカキクケコ!<>-_\\/[]{}—=+*^?#'

export function useTextScramble(text, trigger = true) {
    const [output, setOutput] = useState(text)

    useEffect(() => {
        if (!trigger) return

        let iteration = 0
        const interval = setInterval(() => {
            setOutput(
                text.split('').map((char, i) => {
                    if (char === ' ') return ' '
                    if (i < iteration) return text[i]
                    return CHARS[Math.floor(Math.random() * CHARS.length)]
                }).join('')
            )
            iteration += 0.4
            if (iteration >= text.length) clearInterval(interval)
        }, 40)

        return () => clearInterval(interval)
    }, [text, trigger])

    return output
}