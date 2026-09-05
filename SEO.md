# Technische SEO für ZhStudio

## 1. Geänderte Punkte

- Alle echten Seiten werden beim Build aus denselben React-Komponenten wie der sichtbare Auftritt vollständig vorgerendert. Titel, Beschreibung, Canonical, strukturierte Daten, Navigation, FAQ und Inbox-Referenz sind bereits im HTML vorhanden. Es gibt keinen versteckten SEO-Ersatztext mehr.
- `https://zhstudio.ch` ist die einheitliche Hauptdomain. Aufrufe über HTTP oder `www.zhstudio.ch` werden permanent auf HTTPS ohne `www` weitergeleitet.
- Doppelte URL-Varianten mit abschliessendem Slash werden auf die kanonische Variante ohne Slash weitergeleitet.
- Unbekannte Pfade liefern einen echten HTTP-Status `404` und `noindex` statt einer Startseitenkopie mit Status `200`.
- `/danke` bleibt erreichbar, ist aber absichtlich nicht indexierbar und steht weiterhin nicht in der Sitemap.
- Die echten indexierbaren Seiten bleiben `/`, `/leistungen`, `/kontakt`, `/impressum` und `/datenschutz`. Sie sind intern über Navigation oder Footer verlinkt und in der Sitemap enthalten.
- `/website`, `/website/leistungen` und `/website/kontakt` bleiben bewusst permanente Redirects auf `/`, `/leistungen` und `/kontakt`. Sie sollen nicht separat indexiert werden. Auch `/website/danke` bleibt ein Redirect auf die nicht indexierbare Dankeseite.
- Die kanonische Startseite als Ziel von `/website` ist natürlich auf „Webdesign Stäfa“ ausgerichtet. Es wurde keine konkurrierende doppelte Landingpage angelegt.
- `robots.txt`, `sitemap.xml`, strukturierte Unternehmensdaten und die Schreibweise „ZhStudio“ wurden geprüft. Im Repository gibt es keine Marketing-Metadaten mehr.

## 2. In Google Search Console prüfen und einreichen

1. Die Domain-Property `zhstudio.ch` verwenden oder sicherstellen, dass sowohl `https://zhstudio.ch/` als auch die www-Variante verifiziert sind.
2. `https://zhstudio.ch/sitemap.xml` erneut einreichen.
3. Mit der URL-Prüfung den Live-Test für diese fünf kanonischen Seiten ausführen und danach die Indexierung beantragen:
   - `https://zhstudio.ch/`
   - `https://zhstudio.ch/leistungen`
   - `https://zhstudio.ch/kontakt`
   - `https://zhstudio.ch/impressum`
   - `https://zhstudio.ch/datenschutz`
4. Für `/website`, `/website/leistungen` und `/website/kontakt` nur kontrollieren, dass Google den jeweiligen 301-Redirect erkennt. Diese URLs nicht zur Indexierung einreichen und nicht in die Sitemap aufnehmen.
5. `/danke` und `/website/danke` nicht einreichen. `noindex` beziehungsweise Redirect sind dort beabsichtigt.
6. In „Seitenindexierung“ nach einigen Tagen prüfen, ob alte `/website`-Treffer unter „Seite mit Weiterleitung“ erscheinen und die neuen Zielseiten als kanonisch erkannt werden.
7. Alte Google-Snippets mit Marketingtext verschwinden erst nach erneutem Crawling. Keine Löschung beantragen, solange der Treffer auf eine richtige kanonische Seite oder einen korrekten Redirect führt.

## 3. Externe Massnahmen

- Echte lokale Backlinks auf die kanonische Startseite oder passende Leistungsseite aufbauen: Unternehmensverzeichnisse, Gemeinde- und Vereinsseiten, lokale Partner, Lieferanten, Branchenverbände und regionale Medien.
- Bei realisierten Kundenprojekten um einen sachlichen, sichtbaren Hinweis wie „Website von ZhStudio“ bitten, sofern der Kunde freiwillig zustimmt. Keine gekauften Linkpakete oder künstlichen Linknetzwerke verwenden.
- Ein vollständiges Google-Unternehmensprofil mit identischer Schreibweise, Adresse, Telefonnummer und Website pflegen.
- Bestehende Profile und Verzeichniseinträge konsequent auf `https://zhstudio.ch/` aktualisieren, besonders wenn sie noch auf `/website` oder die www-Domain zeigen.
- In Search Console unter „Links“ die verweisenden Domains beobachten. Qualität und lokale Relevanz sind wichtiger als eine hohe Anzahl schwacher Links.

Offizielle Grundlagen: [Google zu Canonicals und Redirects](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [Google zu URL-Änderungen](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes), [Cloudflare zu HTML-URLs](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/).


## 4. Vollständiges HTML ohne Text-Aufblitzen (September 2026)

- `src/entry-server.jsx` rendert alle sechs bekannten Routen beim Build. Das temporäre SSR-Bundle wird danach entfernt; das Hosting bleibt statisch.
- `src/main.jsx` hydriert dieses HTML, statt es durch eine zweite Fassung zu ersetzen. Im Vite-Entwicklungsmodus wird weiterhin ein leerer Root normal gerendert.
- Das reguläre Stylesheet inklusive Referenzgalerie wird als render-blockierender Link im Head geladen. Keine ungestaltete Text-Zwischenversion und keine nur für Bots sichtbaren Texte.
- Ohne JavaScript bleiben Navigation, sichtbare Texte, FAQ, Kontaktwege und Galerie verfügbar. Die bestehenden Scroll-Animationen werden erst aktiviert, wenn der Observer bereit ist. WebGL bleibt eine verzögert geladene Erweiterung.
- Strukturierte Daten für die jeweilige Seite, Webdesign-Leistung, Inbox-Referenz und vorhandene FAQ werden im Build und bei clientseitiger Navigation synchron gehalten. Die FAQ verwenden dieselben Daten wie der sichtbare Text; daraus folgt keine Zusage für Google-Rich-Results.
- `npm test` baut die Website und prüft alle Routen auf vollständiges HTML, Stylesheets, Metadaten, Referenzen und Indexierungsregeln.

Bei weiteren Änderungen weiterhin auf Mobil und Desktop gegen den bisherigen Auftritt vergleichen und mit verzögertem/ausgeschaltetem JavaScript testen. Veröffentlichte Inhalte und Layout werden für SEO nicht durch separate Keyword-Texte ersetzt.

Das im verwalteten Google-Unternehmensprofil bestätigte LinkedIn-Unternehmensprofil ist unter `sameAs` mit der Unternehmensidentität verknüpft: https://www.linkedin.com/company/zhstudio.
