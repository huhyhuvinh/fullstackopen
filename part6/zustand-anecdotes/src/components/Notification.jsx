import { useNotification } from '../store'

const Notification = () => {
    const notification = useNotification()

    const style = {
        border: 'solid',
        padding: 10,
        borderWidth: 1,
        marginBottom: 10
    }

    if (!notification) {
        return null
    }

    return <div style={style}>{notification}</div>
}

export default Notification
