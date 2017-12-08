"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_events_1 = require("typescript.events");
class PeerStub extends typescript_events_1.Event {
    constructor() {
        super();
        this.id = (PeerStub.idCounter++).toString();
    }
    offerConnection(param) {
        this.otherPeer = param;
        param.answerConnection(this);
        this.onConnected();
        return this;
    }
    answerConnection(otherPeer) {
        this.otherPeer = otherPeer;
        this.onConnected();
    }
    onConnected() {
        this.emit('connected', this.otherPeer);
        return "connected with peer " + this.otherPeer.id;
    }
    onDisconnected() {
        this.emit('disconnected', this.otherPeer);
        return "disconnected from peer " + this.otherPeer.id;
    }
    sendData(data) {
        this.onSendData(data);
        this.otherPeer.receiveData(data);
    }
    receiveData(data) {
        this.onReceivedData(data);
        return data;
    }
    onSendData(data) {
        this.emit('data-sent', data);
        return data;
    }
    onReceivedData(data) {
        this.emit('data-received', data);
        return data;
    }
    onError(error) {
        this.emit('error', error);
        return error;
    }
    onSignal(signal) {
        this.emit('signal', signal);
        return signal;
    }
}
PeerStub.idCounter = 0;
exports.PeerStub = PeerStub;
