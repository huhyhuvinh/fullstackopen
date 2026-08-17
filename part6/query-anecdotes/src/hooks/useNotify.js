import { useContext } from 'react'
import NotificationContext from '../notificationContext'

const useNotify = () => useContext(NotificationContext)

export default useNotify
