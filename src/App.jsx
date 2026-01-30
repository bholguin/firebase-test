import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { getApp, getApps, initializeApp } from 'firebase/app'
import { getMessaging, getToken as getFirebaseToken, isSupported } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: 'AIzaSyBWZo3lO4ckL6mGE5szGbJ3KPSy772ibfU',
  authDomain: 'suscription-72c84.firebaseapp.com',
  projectId: 'suscription-72c84',
  storageBucket: 'suscription-72c84.firebasestorage.app',
  messagingSenderId: '98945309445',
  appId: '1:98945309445:web:83ffda424cd7888842f56c',
  measurementId: 'G-121MQLFJGY',
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
const messaging = getMessaging(app)

console.log(messaging)

function App() {
  const [count] = useState(0)
  const [swStatus, setSwStatus] = useState('checking')
  const [fcmSupport, setFcmSupport] = useState('checking')

  const vapidKeyid =
  'BC7mYAyEYswGO66U5uKFKZauSxF06OOt0jccHPKfOusuSx-rINotLS7RgtR90_xsJBZMv0o1TmW9SQ4ljDKzxa8';

  const waitForActiveServiceWorker = async (registration) => {
    if (registration.active) return registration

    const sw = registration.installing || registration.waiting
    if (!sw) return registration

    await new Promise((resolve) => {
      const onStateChange = () => {
        if (sw.state === 'activated') {
          sw.removeEventListener('statechange', onStateChange)
          resolve()
        }
      }
      sw.addEventListener('statechange', onStateChange)
    })

    return registration
  }

  const getOrRegisterServiceWorker = async () => {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service workers no están disponibles en este navegador.')
    }
    // Obtén la registration del scope actual (más confiable que pasar la URL del script)
    const existing = await navigator.serviceWorker.getRegistration()
    const registration =
      existing ??
      (await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' }))

    await waitForActiveServiceWorker(registration)
    // Asegura que esté activo y controlando la página
    return await navigator.serviceWorker.ready
  }

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const supported = await isSupported()
        if (!cancelled) setFcmSupport(supported ? 'supported' : 'not_supported')

        if (!('serviceWorker' in navigator)) {
          if (!cancelled) setSwStatus('unsupported')
          return
        }

        const regs = await navigator.serviceWorker.getRegistrations()
        const match = regs.find((r) => {
          const urls = [
            r.active?.scriptURL,
            r.waiting?.scriptURL,
            r.installing?.scriptURL,
          ].filter(Boolean)
          return urls.some((u) => String(u).endsWith('/firebase-messaging-sw.js'))
        })

        if (!match) {
          if (!cancelled) setSwStatus('not_registered')
          console.log('[SW] firebase-messaging-sw.js NOT registered')
          return
        }

        const sw = match.active || match.waiting || match.installing
        const state = sw?.state ?? 'unknown'
        if (!cancelled) setSwStatus(`registered:${state}`)
        console.log('[SW] firebase-messaging-sw.js registered', {
          scope: match.scope,
          state,
          scriptURL: sw?.scriptURL,
        })
      } catch (e) {
        if (!cancelled) setSwStatus('error')
        console.error('[SW] registration check failed', e)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const requestToken = async () => {
    try {
      if (!window.isSecureContext) {
        throw new Error('Push/FCM requiere un contexto seguro (HTTPS o localhost).')
      }
      const supported = await isSupported()
      if (!supported) {
        throw new Error('FCM no está soportado en este navegador/entorno.')
      }
      if (!('Notification' in window)) return
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') return

      const registration = await getOrRegisterServiceWorker()
      const currentToken = await getFirebaseToken(messaging, {
        vapidKey: vapidKeyid,
        serviceWorkerRegistration: registration,
      })
      console.log(currentToken)
    } catch (error) {
      console.error('[FCM] getToken error', {
        name: error?.name,
        code: error?.code,
        message: error?.message,
        stack: error?.stack,
        customData: error?.customData,
      })
      console.error(error)
    }
  }
 


  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <p>FCM: {fcmSupport}</p>
        <p>SW: {swStatus}</p>
        <button onClick={requestToken}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
