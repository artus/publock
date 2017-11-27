"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageChain_1 = require("./MessageChain");
const SimplePeer = require("simple-peer");
const wrtc = require("wrtc");
class Publock {
    constructor(logging = true, messageChain = new MessageChain_1.MessageChain()) {
        this.logging = logging;
        this.messageChain = messageChain;
        this.connections = new Map();
        this.initialiseOfferingConnection();
        this.initialiseAnsweringConnection();
    }
    get messageChain() {
        return this._messageChain;
    }
    set messageChain(newMessageChain) {
        this._messageChain = newMessageChain;
    }
    // Methods
    initialiseOfferingConnection() {
        let newPeer = new SimplePeer({ initiator: true, wrtc: wrtc, trickle: false });
        newPeer.on('signal', data => {
            this.offer = JSON.stringify(data);
        });
        newPeer.on('connect', () => {
            this.connections.set(newPeer._id, newPeer);
            this.initialiseOfferingConnection();
        });
        newPeer.on('data', data => {
            this.dataReceived(newPeer._id, data);
        });
        newPeer.on('error', error => {
            console.log(error);
            newPeer.destroy();
        });
        this.offeringConnection = newPeer;
        this.log("Offering connection initialised.");
    }
    initialiseAnsweringConnection() {
        let newPeer = new SimplePeer({ wrtc: wrtc, trickle: false });
        newPeer.on('signal', data => {
            this.answer = JSON.stringify(data);
        });
        newPeer.on('connect', () => {
            this.connections.set(newPeer._id, newPeer);
            this.initialiseAnsweringConnection();
        });
        newPeer.on('data', data => {
            this.dataReceived(newPeer._id, data);
        });
        newPeer.on('error', error => {
            console.log(error);
            newPeer.destroy();
        });
        this.answeringConnection = newPeer;
        this.log("Answering connection initialised.");
    }
    answerConnection(offer) {
        this.answeringConnection.signal(JSON.parse(offer));
    }
    connectToPeer(answer) {
        this.offeringConnection.signal(JSON.parse(answer));
    }
    dataReceived(connectionId, data) {
        console.log(connectionId + " sent: " + data);
    }
    sendData(connectionId, data) {
        this.connections.get(connectionId).send(data);
    }
    log(message) {
        if (this.logging)
            console.log(message);
    }
}
exports.Publock = Publock;
