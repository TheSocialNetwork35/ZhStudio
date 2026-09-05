import { createElement } from 'react'
import { prerenderToNodeStream } from 'react-dom/static'
import App from './App.jsx'

export async function render(pathname) {
  const { prelude } = await prerenderToNodeStream(createElement(App, { initialPathname: pathname }))
  prelude.setEncoding('utf8')
  let html = ''
  for await (const chunk of prelude) html += chunk
  return html
}
