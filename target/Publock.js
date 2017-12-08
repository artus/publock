"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageChain_1 = require("./MessageChain");
const PeerStub_1 = require("./PeerStub");
class Publock {
    constructor(logging = false, messageChain = new MessageChain_1.MessageChain()) {
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
        let offeringPeer = new PeerStub_1.PeerStub();
        offeringPeer.on('connected', (peer) => {
            this.connections.set(offeringPeer.id, offeringPeer);
            this.log("connected with peer " + peer.id);
        });
        offeringPeer.on('disconnected', (peer) => {
            this.connections.delete(offeringPeer.id);
            this.log("disconnected with peer " + peer.id);
        });
        offeringPeer.on('data-received', (data) => this.dataReceived(offeringPeer.otherPeer.id, data));
        offeringPeer.on('data-sent', (data) => this.log("sent data:" + data));
        this.offeringConnection = offeringPeer;
    }
    initialiseAnsweringConnection() {
        let answeringPeer = new PeerStub_1.PeerStub();
        answeringPeer.on('connected', (peer) => {
            this.connections.set(answeringPeer.id, answeringPeer);
            this.log("connected with peer " + peer.id);
        });
        answeringPeer.on('disconnected', (peer) => {
            this.connections.delete(answeringPeer.id);
            this.log("disconnected with peer " + peer.id);
        });
        answeringPeer.on('data-received', (data) => this.dataReceived(answeringPeer.otherPeer.id, data));
        answeringPeer.on('data-sent', (data) => this.log("sent data:" + data));
        this.answeringConnection = answeringPeer;
    }
    answerConnection(offer) {
        this.answeringConnection.answerConnection(offer);
    }
    connectToPeer(answer) {
        this.offeringConnection.offerConnection(answer);
    }
    dataReceived(connectionId, data) {
        this.log(connectionId + ": " + data);
    }
    sendData(connectionId, data) {
        this.connections.get(connectionId).sendData(data);
    }
    log(message) {
        if (this.logging)
            console.log(message);
    }
}
exports.Publock = Publock;
