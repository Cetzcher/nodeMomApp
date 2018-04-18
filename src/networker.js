// @flow

import { WS_URL } from "./constants"

class Networker {

    data : string[];
    ws : ?WebSocket;
    connected : boolean;

    name : string;
    pw : string;

    onJoin : (topic : string) => void
    onCreate : () => void
    onData : (data : string[], topic : string) => void
    onErr : (err : any) => void

    constructor() {
        this.data = []
        this.ws = null
        this.name = ""
        this.pw = ""
        this.connected = false

        this.onData = this.onJoin = this.onData = this.onErr = () => console.log("recv");

    }

    setTopic(topic : string) {
        this.name = topic
    }

    setPw(pw : string) {
        this.pw = pw
    }


    init() {
        this.ws = new WebSocket(WS_URL)
        this.ws.onopen = () => {
            console.log("Connected")
            this.connected = true
        }
        this.ws.onclose = () => {
            console.log("Closed")
            this.connected = false
            this.ws = null
        }
        this.ws.onmessage = (e) => {
            const data = e.data
            const parsed = JSON.parse(String(data))
            // TODO: create actual types in JSON return
            if(!parsed.success) {
                // TODO: notify of error
            }
            console.log("networker.js ... ws.onmessage(), parsed:", parsed)
            switch(parsed.type) {
                case "new": 
                    console.log("networker.js ... ws.onmessage() recv new")            
                    break
                case "subscribe":
                    // got subscribe msg.
                    console.log("networker.js ... ws.onmessage() recv subscribe")
                    // subscribe sends inital data.
                    if(!parsed.topic)
                        console.log("NO TOPIC RECV")
                    this.onJoin(parsed.topic)
                    this.onData(parsed.data, parsed.topic)
                    break
                case "data":
                    if(!parsed.topic)
                        console.log("NO TOPIC RECV")
                    console.log("networker.js ... ws.onmessage() recv notify, data: ", parsed.data)                
                    this.onData(parsed.data, parsed.topic)
                    break
            }
        }   
        this.ws.onerror = (e) => {
            console.log("networker.js ... ws.onerror(), e.type:", e.type)
            try {
                this.connected = false
                this.onErr(e.type)
                if(this.ws)
                    this.ws.close()
            } catch (err) {
                console.log(err);
            }
        }
    }

    sendCreate() {
        const name = this.name
        const pw = this.pw
        if (!this.ws) return        
        this.ws.send(JSON.stringify({
            action: "new",
            topic: name,
            topicPass : pw
        }))
    }

    sendJoin() {
        const name = this.name
        const pw = this.pw
        if (!this.ws) return        
        this.ws.send(JSON.stringify({
            action: "subscribe",
            topic: name,
            topicPass : pw
        }))
    }

    sendUpdateData(data : string[]) {
        const name = this.name
        const pw = this.pw
        if (!this.ws) return
        this.ws.send(JSON.stringify({
            action: "notify",
            topic: name,
            topicPass : pw,
            data: data
        }))
    }
}

const networker = new Networker()
export default networker