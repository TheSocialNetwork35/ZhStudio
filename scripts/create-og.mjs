import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url))
const projectDirectory = path.resolve(scriptDirectory, '..')
const logoPath = path.join(projectDirectory, 'public', 'logo-mark.png')
const french = process.argv.includes('--fr')
const outputPath = path.join(projectDirectory, 'public', french ? 'og-fr.png' : 'og.png')

const background = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#f3f3f1"/>
    <g stroke="#111216" stroke-opacity="0.09" stroke-width="1">
      <path d="M0 105h1200M0 315h1200M0 525h1200"/>
      <path d="M80 0v630M520 0v630M920 0v630M1120 0v630"/>
    </g>
    <rect x="0" y="0" width="1200" height="10" fill="#5362e8"/>
    <rect x="825" y="132" width="292" height="292" rx="28" fill="#111216"/>
    <circle cx="1070" cy="112" r="72" fill="none" stroke="#5362e8" stroke-width="2"/>
    <circle cx="1070" cy="112" r="54" fill="none" stroke="#111216" stroke-opacity="0.14"/>
    <text x="76" y="102" fill="#5362e8" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" letter-spacing="3">ZHSTUDIO / STÄFA</text>
    <text x="76" y="235" fill="#111216" font-family="Arial, Helvetica, sans-serif" font-size="${french ? 70 : 78}" font-weight="700" letter-spacing="-4">
      <tspan x="76" dy="0">${french ? 'Des sites web qui' : 'Websites, die'}</tspan>
      <tspan x="76" dy="82">${french ? 'inspirent confiance.' : 'Vertrauen schaffen.'}</tspan>
    </text>
    <text x="78" y="505" fill="#666970" font-family="Arial, Helvetica, sans-serif" font-size="${french ? 23 : 27}">${french ? 'Création de sites web pour les entreprises du canton de Zurich.' : 'Webdesign für Unternehmen im Kanton Zürich.'}</text>
    <text x="78" y="568" fill="#111216" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700">zhstudio.ch</text>
  </svg>`

const logo = await sharp(logoPath).resize(190, 190, { fit: 'contain' }).png().toBuffer()

await sharp(Buffer.from(background))
  .composite([{ input: logo, left: 876, top: 183 }])
  .png({ compressionLevel: 9 })
  .toFile(outputPath)

console.log(`Created ${outputPath}`)
