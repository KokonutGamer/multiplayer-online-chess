import { Client } from "@stomp/stompjs"
import { useEffect } from "react"

function OnlinePlayPage() {
    useEffect(() => {
        const stompClient = new Client({
            brokerURL: `ws://${import.meta.env.VITE_API_DOMAIN}/ws`,
            connectHeaders: {
                userId: 'abc'
            },
            debug: (msg) => {
                console.log(`STOMP debug: ${msg}`)
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000
        })

        stompClient.onConnect = (frame) => {
            console.log("Connected")
            console.log(`Additional details: ${frame.body}`)
        }

        stompClient.onStompError = (frame) => {
            console.log(`Broker reported error: ${frame.headers['message']}`)
            console.log(`Additional details: ${frame.body}`)
        }

        // establish a connection to the server
        stompClient.activate()

        return async () => {
            await stompClient.deactivate()
        }
    })

    return (
        <h1>Play online</h1>
    )
}

export default OnlinePlayPage
