import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useTextScramble } from '../../hooks/useTextScramble'

export default function ScrambleText({ text, as: Tag = 'span', className }) {
    const { ref, isVisible } = useScrollReveal({ threshold: 0.3 })
    const output = useTextScramble(text, isVisible)

    return (
        <Tag ref={ref} className={className}>
            {output}
        </Tag>
    )
}