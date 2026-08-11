import { Alert } from '@mui/material'

const Notification = ({ message }) => {
    return (
        <div>
            {message && (
                <Alert severity={message.type} style={{ marginTop: 10, marginBottom: 10 }}>
                    {message.content}
                </Alert>
            )}
        </div>
    )
}

export default Notification
