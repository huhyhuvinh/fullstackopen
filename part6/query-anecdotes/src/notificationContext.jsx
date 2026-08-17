import { createContext, useState } from 'react'

const NotificationContext = createContext()

export default NotificationContext

export const NotificationContextProvider = (props) => {
    const [notification, setNotification] = useState(null)

    const showNotification = (content) => {
        setNotification(content)
        setTimeout(() => {
            setNotification(null)
        }, 5000)
    }

    return (
        <NotificationContext.Provider
            value={{
                notification,
                setNotification,
                showNotification
            }}
        >
            {props.children}
        </NotificationContext.Provider>
    )
}
