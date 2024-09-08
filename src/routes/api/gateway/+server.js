import { initialize } from "esbuild";
import websocket from "ws"
const bot_token = ""; //replace with bot token

const initialUrl = "wss://gateway.discord.gg"
let url = initialUrl;
let sessionId = "";
let ws;
let interval = 0;
let seq = -1

let payload = {
    op: 2,
    d: {
        token: bot_token,
        intents: 34304,
        properties: {
            $os: "windows",
            $browser: "edge",
            $device: "desktop"
        }
    }
}

const hearbeat = (ms) => {
    return setInterval(() => {
        ws.send(JSON.stringify({ op: 1, d: null }))
    }, ms)
}

const initializeWebsocket = () => {
    if (ws && ws.readyState != 3) {
        ws.close()
    }

    let wasReady = false;

    ws = new websocket(url + "/?v=10&encoding=json");

    ws.on("open", function open() {
        if (url !== initialUrl) {
            const resumePayload = {
                op: 6,
                d: {
                    token: bot_token,
                    session_id: sessionId,
                    seq: seq
                }
            }
            ws.send(JSON.stringify(resumePayload))
        }
        ws.send(JSON.stringify(payload))
        interval = hearbeat(41250)
    })

    ws.on("error", function error(err) {
        console.log(err)
    })

    ws.on("close", function close() {
        clearInterval(interval)
        if (wasReady) {
            console.log("Reconnecting...")
            
            setTimeout(() => {
                initializeWebsocket()
                console.log("Reconnected!")
            }, 2500)
        }
    })

    ws.on("message", function incoming(data) {
        const p = JSON.parse(data)
        const {t, op, d, s} = p

        switch (op) {
            case 10:
                const {heartbeat_interval} = d
                interval = hearbeat(heartbeat_interval)
                wasReady = true

                if (url === initialUrl) {
                    ws.send(JSON.stringify(payload))
                }
                break;
            case 0:
                seq = s;
                break;
        }
        console.log(t)
        switch (t) {
            case "READY":
                console.log("Gateway ready!")
                url = d.resume_gateway_url
                sessionId = d.session_id
                break;
            case "RESUMED":
                console.log("Gateway resumed!")
                break;
            case "MESSAGE_CREATE":
                console.log(d)
                let author = d.author.username
                let content = d.content
                let msg_channel_id = d.channel_id
                console.log(`[${author}]: ${content}`)
                break;
            case "MESSAGE_REACTION_ADD":
                console.log(d)
                let user = d.member.user.username
                let emoji = d.emoji.name
                let msg_id = d.message_id
                console.log(`[${user}] reacted with ${emoji} on message ${msg_id}`)
                if (emoji == "✏️") {
                    console.log(d.channel_id)
                    fetch(`https://discord.com/api/v10/channels/${d.channel_id}`, {
                        headers: {
                            Authorization: `Bot ${bot_token}`,
                        }
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log(data);
                    })
                    .catch(error => {
                        console.error('Error fetching thread response:', error);
                    });
                }
                break;
        }
    })
}

initializeWebsocket()