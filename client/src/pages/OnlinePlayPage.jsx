import { Client } from "@stomp/stompjs"
import { useEffect, useRef, useState } from "react"

function OnlinePlayPage() {
    const stompClientRef = useRef(null)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        const stompClient = new Client({
            brokerURL: `ws://${import.meta.env.VITE_API_DOMAIN}/ws`,
            connectHeaders: {
                userId: 'abc'
            },
            debug: (msg) => console.log(`STOMP debug: ${msg}`),
            reconnectDelay: 5000,
            heartbeatIncoming: 20000,
            heartbeatOutgoing: 20000
        })

        // TODO within this onConnect property, we will generate a UUID for this user
        stompClient.onConnect = (frame) => {
            setIsConnected(true)
            console.log("Connected")
            console.log(`Additional details: ${frame.body}`)
        }

        stompClient.onWebSocketError = (error) => {
            console.error("Error with websocket", error)
        }

        stompClient.onStompError = (frame) => {
            console.error(`Broker reported error: ${frame.headers['message']}`)
            console.error(`Additional details: ${frame.body}`)
        }

        stompClient.onDisconnect = () => {
            setIsConnected(false)
        }

        // establish a connection to the server
        stompClient.activate()
        stompClientRef.current = stompClient

        // clean up STOMP connection
        return async () => {
            if (stompClientRef.current) {
                await stompClientRef.current.deactivate()
            }
        }
    }, []) // runs only mount

    const hostRequest = () => {
        if (stompClientRef.current && stompClientRef.current.connected) {
            stompClientRef.current.publish({
                destination: '/app/game/host',
                body: JSON.stringify({
                    userId: "054be67d-d05f-4187-a75b-601d4c9d5339" // TODO part of client connect
                })
            })
        }
    }

    return (
        <div>
            <h1>Play online</h1>
            <button onClick={hostRequest}></button>
        </div>
    )
}

export default OnlinePlayPage
