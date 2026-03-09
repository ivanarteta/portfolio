import './style.css'
import { translations } from './translations.js'

// Estado global
let currentLang = localStorage.getItem('lang') || 'es'
let currentTheme = localStorage.getItem('theme') || 'dark'

// Aplicar tema inicial
function applyTheme(theme) {
  const html = document.documentElement
  
  if (theme === 'light') {
    html.classList.add('light-theme')
  } else {
    html.classList.remove('light-theme')
  }
  
  // Actualizar icono del tema
  const themeIcon = document.getElementById('theme-icon')
  if (themeIcon) {
    if (theme === 'light') {
      themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />'
    } else {
      themeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />'
    }
  }
}

// Cambiar tema
function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark'
  localStorage.setItem('theme', currentTheme)
  applyTheme(currentTheme)
  updateThemeClasses()
}

// Actualizar clases de tema en elementos específicos
function updateThemeClasses() {
  // Las clases CSS se aplican automáticamente con el selector html.light-theme
}

// Cambiar idioma
function changeLanguage(lang) {
  currentLang = lang
  localStorage.setItem('lang', lang)
  
  const t = translations[lang]
  document.documentElement.lang = lang
  
  // Actualizar todos los elementos con data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')
    if (t[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.value = t[key]
      } else {
        el.innerHTML = t[key]
      }
    }
  })
  
  // Actualizar texto del botón de idioma
  const langText = document.getElementById('lang-text')
  if (langText) {
    langText.textContent = lang.toUpperCase()
  }

  // Actualizar aria-labels (accesibilidad)
  document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria-label')
    if (t[key]) {
      el.setAttribute('aria-label', t[key])
    }
  })
}

// Toggle idioma
function toggleLanguage() {
  const newLang = currentLang === 'es' ? 'en' : 'es'
  changeLanguage(newLang)
}

// Inicializar
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("opacity-100", "translate-y-0")
      }
    })
  },
  { threshold: 0.1 }
)

document.querySelectorAll("section").forEach(section => {
  section.classList.add("opacity-0", "translate-y-10", "transition-all", "duration-700")
  observer.observe(section)
})

// Configurar botones y inicializar
function init() {
  // Aplicar tema e idioma guardados
  applyTheme(currentTheme)
  changeLanguage(currentLang)
  updateThemeClasses()
  
  // Event listeners
  const themeToggle = document.getElementById('theme-toggle')
  const langToggle = document.getElementById('lang-toggle')
  
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme)
  }
  
  if (langToggle) {
    langToggle.addEventListener('click', toggleLanguage)
  }
}

// Barra de navegación: mostrar al hacer scroll
function setupNavScroll() {
  const nav = document.getElementById('main-nav')
  if (!nav) return

  const showNav = () => {
    if (window.scrollY > 80) {
      nav.classList.remove('translate-y-[-100%]')
      nav.classList.add('translate-y-0')
    } else {
      nav.classList.add('translate-y-[-100%]')
      nav.classList.remove('translate-y-0')
    }
  }

  window.addEventListener('scroll', showNav, { passive: true })
  showNav() // estado inicial
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    init()
    setupNavScroll()
  })
} else {
  init()
  setupNavScroll()
}

// Función genérica para acordeones
function setupAccordion(toggleId, contentId, arrowId) {
  const toggle = document.getElementById(toggleId)
  const content = document.getElementById(contentId)
  const arrow = document.getElementById(arrowId)

  if (toggle && content && arrow) {
    toggle.addEventListener('click', () => {
      const isExpanded = content.classList.contains('max-h-[2000px]')
      
      if (isExpanded) {
        content.classList.remove('max-h-[2000px]')
        content.classList.add('max-h-0')
        arrow.classList.remove('rotate-180')
        toggle.setAttribute('aria-expanded', 'false')
      } else {
        content.classList.remove('max-h-0')
        content.classList.add('max-h-[2000px]')
        arrow.classList.add('rotate-180')
        toggle.setAttribute('aria-expanded', 'true')
      }
    })
  }
}

// Configurar acordeones
setupAccordion('noe-toggle', 'noe-content', 'noe-arrow')
setupAccordion('pamplona-toggle', 'pamplona-content', 'pamplona-arrow')
setupAccordion('servers-toggle', 'servers-content', 'servers-arrow')
setupAccordion('experience-toggle', 'experience-content', 'experience-arrow')