import { useLocale } from '../i18n.jsx'
import { useEffect, useRef, useState } from 'react'
import './NotFoundPage.css'

export default function NotFoundPage() {
  const { t, href: toLocale } = useLocale()
  const scene = useRef(null)
  const [ready, setReady] = useState(false)
  const [aligned, setAligned] = useState(false)

  useEffect(() => { setReady(true) }, [])

  function followPointer(event) {
    if (!window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return
    const bounds = event.currentTarget.getBoundingClientRect()
    scene.current.style.setProperty('--look-x', `${((event.clientX - bounds.left) / bounds.width - 0.5) * 14}px`)
    scene.current.style.setProperty('--look-y', `${((event.clientY - bounds.top) / bounds.height - 0.5) * 10}px`)
  }

  function resetPointer() {
    scene.current.style.setProperty('--look-x', '0px')
    scene.current.style.setProperty('--look-y', '0px')
  }

  return (
    <main className="not-found" aria-labelledby="not-found-title">
      <div className="not-found-topline"><span className="eyebrow">{t("Ein kleiner Umweg.")}</span><span className="not-found-status"><i />{t("Seite nicht gefunden")}</span></div>
      <div className={`not-found-scene${aligned ? ' is-aligned' : ''}`} ref={scene} onPointerMove={followPointer} onPointerLeave={resetPointer}>
        <div className="not-found-orbit" aria-hidden="true" />
        <div className="not-found-number" aria-hidden="true"><span>4</span><span className="not-found-zero">0<span className="not-found-compass">↗</span></span><span>4</span></div>
        {ready && <button className="not-found-play" onClick={() => setAligned(value => !value)} aria-label={t("Kompass neu ausrichten")} aria-pressed={aligned}><span aria-hidden="true">↗</span> {aligned ? t("Noch eine Runde?") : t("Zurück auf Kurs?")}</button>}
        <span className="not-found-coordinate" aria-hidden="true">ZH / STUDIO — 404</span>
      </div>
      <section className="not-found-bottom">
        <div className="not-found-copy">
          <h1 id="not-found-title">{t("Kurz vom Weg abgekommen.")}</h1>
          <p>{t("Diese Seite gibt es hier leider nicht. Vielleicht hat sich ein Tippfehler eingeschlichen oder der Link ist nicht mehr aktuell.")}</p>
          <p className="not-found-live" role="status">{aligned ? t("Wieder auf Kurs. Die Startseite ist nur einen Klick entfernt.") : t("Kein Problem. Hier geht’s weiter.")}</p>
        </div>
        <div className="not-found-navigation">
          <a className="button button-primary not-found-home" href={toLocale("/")}>{t("Zur Startseite")}{' '}<span aria-hidden="true">↗</span></a>
          <div className="not-found-links"><a href={toLocale("/leistungen")}>{t("Leistungen")}{' '}<span aria-hidden="true">↗</span></a><a href={toLocale("/kontakt")}>{t("Kontakt")}{' '}<span aria-hidden="true">↗</span></a>{ready && <button onClick={() => window.history.length > 1 ? window.history.back() : window.location.assign(toLocale('/'))}>{t("← Zurück")}</button>}</div>
        </div>
      </section>
    </main>
  )
}
