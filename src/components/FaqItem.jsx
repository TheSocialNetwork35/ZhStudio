import { useEffect, useRef } from 'react'

export default function FaqItem({ question, answer }) {
  const detailsRef = useRef(null)
  const animationRef = useRef(null)
  const targetRef = useRef(null)

  useEffect(() => () => animationRef.current?.cancel(), [])

  function toggle(event) {
    event.preventDefault()
    const details = detailsRef.current
    const opening = !(targetRef.current ?? details.open)
    const startHeight = details.getBoundingClientRect().height
    if (animationRef.current) {
      animationRef.current.onfinish = null
      animationRef.current.cancel()
      animationRef.current = null
    }
    targetRef.current = opening
    details.dataset.expanded = String(opening)
    details.style.height = ''
    details.style.overflow = ''

    // Native details still work without JS. Keyboard and reduced-motion users
    // get an immediate toggle; pointer interactions animate from the current size.
    const instant = event.detail === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !details.animate
    details.dataset.instant = String(instant)
    if (instant) {
      details.open = opening
      targetRef.current = null
      return
    }

    details.open = true
    const endHeight = opening
      ? details.getBoundingClientRect().height
      : details.querySelector('summary').getBoundingClientRect().height + parseFloat(getComputedStyle(details).borderBottomWidth || 0) + parseFloat(getComputedStyle(details).borderTopWidth || 0)
    details.style.height = `${startHeight}px`
    details.style.overflow = 'hidden'
    const animation = details.animate(
      { height: [`${startHeight}px`, `${endHeight}px`] },
      { duration: opening ? 240 : 190, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' },
    )
    animationRef.current = animation
    animation.onfinish = () => {
      details.open = opening
      details.style.height = ''
      details.style.overflow = ''
      animationRef.current = null
      targetRef.current = null
    }
  }

  return (
    <details ref={detailsRef}>
      <summary onClick={toggle}><span>{question}</span><i aria-hidden="true">+</i></summary>
      <div className="faq-answer"><p>{answer}</p></div>
    </details>
  )
}
