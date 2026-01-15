import './style.css'
import { translations } from './translations.js'
import emailjs from '@emailjs/browser'

// Estado global
let currentLang = localStorage.getItem('lang') || 'es'
let currentTheme = localStorage.getItem('theme') || 'dark'

const EMAILJS_PUBLIC_KEY = 'UxgNssHj94NSUva69' 
const EMAILJS_SERVICE_ID = 'service_iym7isa' 
const EMAILJS_TEMPLATE_ID = 'template_l970j2k'

// Inicializar EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY)

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
  
  // Actualizar placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder')
    if (t[key]) {
      el.placeholder = t[key]
    }
  })
  
  // Actualizar texto del botón de idioma
  const langText = document.getElementById('lang-text')
  if (langText) {
    langText.textContent = lang.toUpperCase()
  }
}

// Toggle idioma
function toggleLanguage() {
  const newLang = currentLang === 'es' ? 'en' : 'es'
  changeLanguage(newLang)
}

// Mostrar mensaje de feedback
function showMessage(message, type = 'success') {
  const messageDiv = document.getElementById('form-message')
  messageDiv.className = `p-4 rounded-lg text-sm ${
    type === 'success' 
      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
      : 'bg-red-500/20 text-red-400 border border-red-500/30'
  }`
  messageDiv.textContent = message
  messageDiv.classList.remove('hidden')
  
  // Ocultar después de 5 segundos
  setTimeout(() => {
    messageDiv.classList.add('hidden')
  }, 5000)
}

// Validar formulario
function validateForm(formData) {
  const { user_name, user_email, subject, message } = formData
  
  // Primero verificar que todos los campos estén rellenados
  const emptyFields = []
  if (!user_name || user_name.trim().length === 0) {
    emptyFields.push(currentLang === 'es' ? 'nombre' : 'name')
  }
  if (!user_email || user_email.trim().length === 0) {
    emptyFields.push(currentLang === 'es' ? 'email' : 'email')
  }
  if (!subject || subject.trim().length === 0) {
    emptyFields.push(currentLang === 'es' ? 'asunto' : 'subject')
  }
  if (!message || message.trim().length === 0) {
    emptyFields.push(currentLang === 'es' ? 'mensaje' : 'message')
  }
  
  // Si hay campos vacíos, mostrar warning
  if (emptyFields.length > 0) {
    const fieldsText = emptyFields.join(', ')
    showMessage(
      currentLang === 'es' 
        ? `Por favor, completa todos los campos. Faltan: ${fieldsText}` 
        : `Please fill in all fields. Missing: ${fieldsText}`,
      'error'
    )
    return false
  }
  
  // Validaciones específicas
  if (user_name.trim().length < 2) {
    showMessage(
      currentLang === 'es' 
        ? 'El nombre debe tener al menos 2 caracteres' 
        : 'Name must be at least 2 characters',
      'error'
    )
    return false
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(user_email)) {
    showMessage(
      currentLang === 'es' 
        ? 'Por favor, introduce un email válido' 
        : 'Please enter a valid email address',
      'error'
    )
    return false
  }
  
  if (subject.trim().length < 3) {
    showMessage(
      currentLang === 'es' 
        ? 'El asunto debe tener al menos 3 caracteres' 
        : 'Subject must be at least 3 characters',
      'error'
    )
    return false
  }
  
  if (message.trim().length < 10) {
    showMessage(
      currentLang === 'es' 
        ? 'El mensaje debe tener al menos 10 caracteres' 
        : 'Message must be at least 10 characters',
      'error'
    )
    return false
  }
  
  return true
}

// Enviar email
async function sendEmail(formData) {
  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        from_name: formData.user_name,
        from_email: formData.user_email,
        subject: formData.subject,
        message: formData.message,
        to_name: 'Iván Arteta'
      }
    )
    
    if (response.status === 200) {
      showMessage(
        currentLang === 'es' 
          ? '¡Mensaje enviado con éxito! Te responderé pronto.' 
          : 'Message sent successfully! I will reply soon.',
        'success'
      )
      return true
    }
  } catch (error) {
    console.error('Error sending email:', error)
    showMessage(
      currentLang === 'es' 
        ? 'Error al enviar el mensaje. Por favor, inténtalo de nuevo o contáctame directamente por LinkedIn.' 
        : 'Error sending message. Please try again or contact me directly on LinkedIn.',
      'error'
    )
    return false
  }
}

// Manejar envío del formulario
function handleSubmit(e) {
  e.preventDefault()
  
  const form = e.target
  const submitBtn = document.getElementById('submit-btn')
  const formMessage = document.getElementById('form-message')
  
  // Ocultar mensajes anteriores
  formMessage.classList.add('hidden')
  
  // Deshabilitar botón durante el envío
  submitBtn.disabled = true
  const originalText = submitBtn.textContent
  submitBtn.textContent = currentLang === 'es' ? 'Enviando...' : 'Sending...'
  
  // Obtener datos del formulario
  const formData = {
    user_name: form.user_name.value.trim(),
    user_email: form.user_email.value.trim(),
    subject: form.subject.value.trim(),
    message: form.message.value.trim()
  }
  
  // Validar
  if (!validateForm(formData)) {
    submitBtn.disabled = false
    submitBtn.textContent = originalText
    return
  }
  
  // Enviar email
  sendEmail(formData).then(success => {
    submitBtn.disabled = false
    submitBtn.textContent = originalText
    
    if (success) {
      // Limpiar formulario
      form.reset()
    }
  })
}

// Inicializar
function init() {
  // Aplicar tema e idioma guardados
  applyTheme(currentTheme)
  changeLanguage(currentLang)
  
  // Configurar botones
  const themeToggle = document.getElementById('theme-toggle')
  const langToggle = document.getElementById('lang-toggle')
  
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme)
  }
  
  if (langToggle) {
    langToggle.addEventListener('click', toggleLanguage)
  }
  
  // Configurar formulario
  const form = document.getElementById('contact-form')
  if (form) {
    form.addEventListener('submit', handleSubmit)
  }
  
  // Verificar si las credenciales de EmailJS están configuradas
  if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY' || 
      EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' || 
      EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID') {
    console.warn('⚠️ EmailJS no está configurado. Por favor, actualiza las credenciales en src/contact.js')
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
