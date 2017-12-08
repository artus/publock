"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageChain_1 = require("./MessageChain");
const PeerStub_1 = require("./PeerStub");
const PeerMessage_1 = require("./PeerMessage");
class Publock {
    constructor(logging = false, messageChain = new MessageChain_1.MessageChain()) {
        this.messageChainLoaded = false;
        this.id = (Publock.idCounter++).toString();
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
        let offeringPeer = new PeerStub_1.PeerStub(this.id);
        offeringPeer.on('connected', (peer) => {
            this.connections.set(offeringPeer.id, offeringPeer);
            this.log(this.id + ":" + offeringPeer.id + " connected to " + offeringPeer.otherPeer.publockId + ":" + offeringPeer.otherPeer.id);
            let connectionId = offeringPeer.id;
            this.initialiseOfferingConnection();
            this.sendConnectionsToPeer(connectionId);
        });
        offeringPeer.on('disconnected', (peer) => {
            this.connections.delete(offeringPeer.id);
            this.log(this.id + " : " + offeringPeer.id + " disconnected from " + offeringPeer.otherPeer.publockId + " : " + offeringPeer.otherPeer.id);
        });
        offeringPeer.on('data-received', (data) => this.dataReceived(offeringPeer.id, data));
        offeringPeer.on('data-sent', (data) => { });
        this.offeringConnection = offeringPeer;
    }
    initialiseAnsweringConnection() {
        let answeringPeer = new PeerStub_1.PeerStub(this.id);
        answeringPeer.on('connected', (peer) => {
            this.connections.set(answeringPeer.id, answeringPeer);
            this.log(this.id + ":" + answeringPeer.id + " connected to " + answeringPeer.otherPeer.publockId + ":" + answeringPeer.otherPeer.id);
            let connectionId = answeringPeer.id;
            this.initialiseAnsweringConnection();
            this.sendConnectionsToPeer(connectionId);
        });
        answeringPeer.on('disconnected', (peer) => {
            this.connections.delete(answeringPeer.id);
            this.log(this.id + ":" + answeringPeer.id + " disconnected from " + answeringPeer.otherPeer.publockId + ":" + answeringPeer.id);
        });
        answeringPeer.on('data-received', (data) => this.dataReceived(answeringPeer.id, data));
        answeringPeer.on('data-sent', (data) => { });
        this.answeringConnection = answeringPeer;
    }
    answerConnection(offer) {
        this.answeringConnection.answerConnection(offer);
    }
    connectToPeer(answer) {
        if (!this.isConnectedToPublock(answer.publockId))
            this.offeringConnection.offerConnection(answer);
    }
    dataReceived(connectionId, data) {
        //this.log(connectionId + ": " + data);
        this.messageParser(connectionId, data);
    }
    disconnectPeer(connectionId) {
        this.connections.get(connectionId).disconnect(undefined);
    }
    sendData(connectionId, message) {
        this.connections.get(connectionId).sendData(message);
    }
    log(message) {
        if (this.logging)
            console.log(message);
    }
    messageParser(connectionId, message) {
        switch (message.command) {
            case "connect-to-peer":
                this.connectToPeer(message.data);
                break;
            case "load-my-messagechain":
                this.loadMessageChainFromPeer(message.data);
                break;
            case "send-your-messagechain":
                this.sendMessageChainToPeer(message.data);
                break;
            case "send-your-answering-connection":
                this.sendAnsweringConnectionToMiddleMan(connectionId, message.data.forPeer, message.data.publockId);
                break;
            case "my-answering-connection":
                this.sendAnsweringConnectionToPeer(message.data.forPeer, message.data.answer);
                break;
        }
    }
    getConnectionByPublockId(publockId) {
        for (let connection of this.connections.values()) {
            if (connection.otherPeer.publockId == publockId)
                return connection.id;
        }
        return (-1).toString();
    }
    isConnectedToPublock(publockId) {
        for (let connection of this.connections.values()) {
            if (connection.otherPeer.publockId == publockId)
                return true;
        }
        return false;
    }
    sendAnsweringConnectionToMiddleMan(connectionId, forId, publockId) {
        if (!this.isConnectedToPublock(publockId)) {
            let message = new PeerMessage_1.PeerMessage("my-answering-connection", { forPeer: forId, answer: this.answeringConnection });
            this.sendData(connectionId, message);
        }
    }
    sendAnsweringConnectionToPeer(connectionId, answer) {
        let message = new PeerMessage_1.PeerMessage("connect-to-peer", answer);
        this.sendData(connectionId, message);
    }
    sendConnectionsToPeer(connectionId) {
        let otherPublockId = this.connections.get(connectionId).otherPeer.publockId;
        for (let connection of this.connections.values()) {
            if (connection.id != connectionId) {
                let message = new PeerMessage_1.PeerMessage("send-your-answering-connection", { forPeer: connectionId, publockId: otherPublockId });
                this.sendData(connection.id, message);
            }
        }
    }
    loadMessageChainFromPeer(messageChain) {
        if (!this.messageChainLoaded)
            this.messageChain = messageChain;
        this.messageChainLoaded = true;
    }
    sendMessageChainToPeer(connectionId) {
        let newPeerMessage = new PeerMessage_1.PeerMessage("load-my-messagechain", this.messageChain);
        this.connections.get(connectionId).sendData(newPeerMessage);
    }
}
Publock.idCounter = 0;
exports.Publock = Publock;
