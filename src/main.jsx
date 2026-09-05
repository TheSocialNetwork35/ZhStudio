import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'
// Include the reference gallery styles in the blocking stylesheet, even though
// its interactive JavaScript remains lazy-loaded.
import './components/AccordionGallery/AccordionGallery.css'
import './prerender.css'

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

if (!window.location.hash) {
  window.scrollTo(0, 0)
}

const root = document.getElementById('root')
const app = (
  <React.StrictMode>
    <App initialPathname={root.dataset.pathname} />
  </React.StrictMode>
)

if (root.hasAttribute('data-prerendered')) {
  ReactDOM.hydrateRoot(root, app)
} else {
  ReactDOM.createRoot(root).render(app)
}
