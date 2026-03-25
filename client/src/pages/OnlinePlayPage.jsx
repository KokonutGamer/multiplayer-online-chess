import { Client } from "@stomp/stompjs"
import { useEffect, useRef, useState } from "react"

function OnlinePlayPage() {
    const stompClientRef = useRef(null)
    const [isConnected, setIsConnected] = useState(false)


    useEffect(() => {
        let userId = null

        async function fetchUserId() {
            // check if userId is already cached
            if (sessionStorage.getItem("userId")) {
                return sessionStorage.getItem("userId")
            }

            // request a new UUID
            const response = await fetch(`http://${import.meta.env.VITE_API_DOMAIN}/users/generate-id`)
            if(!response.ok) {
                throw new Error(`HTTP error: ${response.status}`)
            }

            // save userId to session storage
            const data = await response.json()
            sessionStorage.setItem("userId", data.userId)
            return data.userId
        }

        userId = fetchUserId()

        const stompClient = new Client({
            brokerURL: `ws://${import.meta.env.VITE_API_DOMAIN}/ws`,
            connectHeaders: { userId },
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
    }, []) // runs only on mount

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
