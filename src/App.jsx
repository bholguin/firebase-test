import {  useCallback, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { getApp, getApps, initializeApp } from 'firebase/app'
import { getMessaging} from 'firebase/messaging'
import { requestMessagingToken } from './firebase'

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
  const [swStatus] = useState('checking')
  const [fcmSupport] = useState('checking')

  const [token, setToken] = useState(null)
  const [tokenError, setTokenError] = useState(null)
  const [notificationPermission, setNotificationPermission] = useState(
    () => (typeof Notification !== 'undefined' ? Notification.permission : 'unsupported')
  )

  const handleTokenClick = useCallback(async () => {
      setToken(null)
      setTokenError(null)

      if (!('Notification' in window)) {
          setTokenError('Notifications are not supported in this browser.')
          return
      }

      let permission = Notification.permission
      if (permission !== 'granted') {
          permission = await Notification.requestPermission()
          setNotificationPermission(permission)
      }

      if (permission !== 'granted') {
          setTokenError(
            permission === 'denied'
              ? 'Notifications are denied. Enable them in the browser to get a token.'
              : 'Notifications permission was not granted.'
          )
          return
      }

      try {
          const currentToken = await requestMessagingToken()
          if (!currentToken) {
              setTokenError("No token returned. Check permission or support.")
              return
          }
          setToken(currentToken)
      } catch (error) {
          if (error instanceof Error) {
              setTokenError(error.message)
          } else {
              setTokenError("Unexpected error while getting token.")
          }
      }
  }, [])

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
        <p>
          Notifications: <strong>{notificationPermission}</strong>
          {notificationPermission !== 'granted' && ' — grant to get token'}
        </p>
        <button onClick={handleTokenClick}>
          Get Token
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      <p>Token: {token}</p>
      <p>Token Error: {tokenError}</p>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
