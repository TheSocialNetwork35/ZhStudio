# Technische SEO für ZhStudio

## 1. Geänderte Punkte

- Alle echten Seiten erhalten bereits beim Build einen eigenen Title, eine eigene Meta Description, einen selbstreferenzierenden Canonical sowie passende Open-Graph- und Twitter-Tags. Das funktioniert damit auch ohne ausgeführtes JavaScript.
- `https://www.zhstudio.ch` ist die einheitliche Hauptdomain. Aufrufe über HTTP oder `https://zhstudio.ch` werden permanent auf HTTPS und `www` weitergeleitet.
- Doppelte URL-Varianten mit abschliessendem Slash werden auf die kanonische Variante ohne Slash weitergeleitet.
- Unbekannte Pfade liefern einen echten HTTP-Status `404` und `noindex` statt einer Startseitenkopie mit Status `200`.
- `/danke` bleibt erreichbar, ist aber absichtlich nicht indexierbar und steht weiterhin nicht in der Sitemap.
- Die echten indexierbaren Seiten bleiben `/`, `/leistungen`, `/kontakt`, `/impressum` und `/datenschutz`. Sie sind intern über Navigation oder Footer verlinkt und in der Sitemap enthalten.
- `/website`, `/website/leistungen` und `/website/kontakt` bleiben bewusst permanente Redirects auf `/`, `/leistungen` und `/kontakt`. Sie sollen nicht separat indexiert werden. Auch `/website/danke` bleibt ein Redirect auf die nicht indexierbare Dankeseite.
- Die kanonische Startseite als Ziel von `/website` ist natürlich auf „Webdesign Stäfa“ ausgerichtet. Es wurde keine konkurrierende doppelte Landingpage angelegt.
- `robots.txt`, `sitemap.xml`, strukturierte Unternehmensdaten und die Schreibweise „ZhStudio“ wurden geprüft. Im Repository gibt es keine Marketing-Metadaten mehr.

## 2. In Google Search Console prüfen und einreichen

1. Die Domain-Property `zhstudio.ch` verwenden oder sicherstellen, dass sowohl `https://www.zhstudio.ch/` als auch die non-www-Variante verifiziert sind.
2. `https://www.zhstudio.ch/sitemap.xml` erneut einreichen.
3. Mit der URL-Prüfung den Live-Test für diese fünf kanonischen Seiten ausführen und danach die Indexierung beantragen:
   - `https://www.zhstudio.ch/`
   - `https://www.zhstudio.ch/leistungen`
   - `https://www.zhstudio.ch/kontakt`
   - `https://www.zhstudio.ch/impressum`
   - `https://www.zhstudio.ch/datenschutz`
4. Für `/website`, `/website/leistungen` und `/website/kontakt` nur kontrollieren, dass Google den jeweiligen 301-Redirect erkennt. Diese URLs nicht zur Indexierung einreichen und nicht in die Sitemap aufnehmen.
5. `/danke` und `/website/danke` nicht einreichen. `noindex` beziehungsweise Redirect sind dort beabsichtigt.
6. In „Seitenindexierung“ nach einigen Tagen prüfen, ob alte `/website`-Treffer unter „Seite mit Weiterleitung“ erscheinen und die neuen Zielseiten als kanonisch erkannt werden.
7. Alte Google-Snippets mit Marketingtext verschwinden erst nach erneutem Crawling. Keine Löschung beantragen, solange der Treffer auf eine richtige kanonische Seite oder einen korrekten Redirect führt.

## 3. Externe Massnahmen

- Echte lokale Backlinks auf die kanonische Startseite oder passende Leistungsseite aufbauen: Unternehmensverzeichnisse, Gemeinde- und Vereinsseiten, lokale Partner, Lieferanten, Branchenverbände und regionale Medien.
- Bei realisierten Kundenprojekten um einen sachlichen, sichtbaren Hinweis wie „Website von ZhStudio“ bitten, sofern der Kunde freiwillig zustimmt. Keine gekauften Linkpakete oder künstlichen Linknetzwerke verwenden.
- Ein vollständiges Google-Unternehmensprofil mit identischer Schreibweise, Adresse, Telefonnummer und Website pflegen.
- Bestehende Profile und Verzeichniseinträge konsequent auf `https://www.zhstudio.ch/` aktualisieren, besonders wenn sie noch auf `/website` oder die non-www-Domain zeigen.
- In Search Console unter „Links“ die verweisenden Domains beobachten. Qualität und lokale Relevanz sind wichtiger als eine hohe Anzahl schwacher Links.

Offizielle Grundlagen: [Google zu Canonicals und Redirects](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [Google zu URL-Änderungen](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes), [Cloudflare zu HTML-URLs](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/).
