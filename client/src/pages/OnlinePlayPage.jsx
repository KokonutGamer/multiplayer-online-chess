import { Client } from "@stomp/stompjs"
import { useEffect, useRef, useState } from "react"

function OnlinePlayPage() {
    const stompClientRef = useRef(null)
    const [isConnected, setIsConnected] = useState(false)


    useEffect(() => {
        async function initializeConnection() {
            // check if accessToken is already cached
            if (sessionStorage.getItem("accessToken")) {
                return sessionStorage.getItem("accessToken")
            }

            // request a new access token
            const response = await fetch(`http://${import.meta.env.VITE_API_DOMAIN}/users/generate-id`, {
                method: 'POST'
            })
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`)
            }

            // save accessToken to session storage
            const data = await response.json()
            sessionStorage.setItem("accessToken", data.accessToken)
            console.log(`fetchAccessToken(): accessToken=${sessionStorage.getItem("accessToken")}`)

            const stompClient = new Client({
                brokerURL: `ws://${import.meta.env.VITE_API_DOMAIN}/ws`,
                connectHeaders: { Authorization: `Bearer ${sessionStorage.getItem("accessToken")}` },
                debug: (msg) => console.log(`STOMP debug: ${msg}`),
                reconnectDelay: 5000,
                heartbeatIncoming: 20000,
                heartbeatOutgoing: 20000
            })
    
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
        }

        initializeConnection()

        // clean up STOMP connection
        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate()
            }
        }
    }, []) // runs only on mount

    const hostRequest = () => {
        if (stompClientRef.current && stompClientRef.current.connected) {
            stompClientRef.current.publish({
                destination: '/app/matchmaking/host'
            })
        }
    }

    return (
        <div>
            <h1>Play online</h1>
            <button onClick={hostRequest}>Host a Game</button>
        </div>
    )
}

export default OnlinePlayPage
