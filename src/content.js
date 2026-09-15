import { localize } from './translate.js'

export const faqs = [
  {
    question: 'Was kostet eine Website bei ZhStudio?',
    answer: 'Einfache Webauftritte starten ab CHF 680. Der konkrete Preis richtet sich nach Umfang, Seitenzahl, Funktionen und dem Zustand der vorhandenen Inhalte. Vor dem Start gibt es eine klare Offerte.',
  },
  {
    question: 'Für welche Unternehmen eignet sich das Angebot?',
    answer: 'ZhStudio arbeitet für lokale Unternehmen, Praxen, Gastronomie, Handwerksbetriebe, Vereine und andere Organisationen, die einen professionellen Webauftritt benötigen.',
  },
  {
    question: 'Kann auch eine bestehende Website überarbeitet werden?',
    answer: 'Ja. Bei einem Redesign wird zuerst geprüft, welche Inhalte, Funktionen und technischen Grundlagen übernommen werden können und wo eine neue Struktur sinnvoller ist.',
  },
  {
    question: 'Was wird für den Projektstart benötigt?',
    answer: 'Hilfreich sind vorhandene Texte, Bilder, Logo-Dateien und ein kurzer Überblick über Ziele und gewünschte Funktionen. Fehlende Grundlagen werden vor Projektbeginn gemeinsam eingeordnet.',
  },
  {
    question: 'Funktioniert die Website auch auf dem Smartphone?',
    answer: 'Ja. Die responsive Umsetzung gehört zum Angebot von ZhStudio. Dabei passen sich Layout und Inhalte an unterschiedliche Bildschirmgrössen an. Auch Schriftgrössen, Abstände und die Bedienung auf mobilen Geräten werden berücksichtigt, damit Besucher Informationen und Kontaktmöglichkeiten gut erreichen können.',
  },
  {
    question: 'Was gehört zur technischen SEO-Basis?',
    answer: 'Zum Angebot gehören technische Grundlagen für Suchmaschinen, etwa eine klare Seitenstruktur, passende Seitentitel und Beschreibungen sowie die technische Vorbereitung auf die Indexierung. Auch Performance-Grundlagen sind Teil der Umsetzung. Eine bestimmte Platzierung bei Google lässt sich daraus nicht garantieren.',
  },
]

export const faqsFor = locale => localize(faqs, locale)
