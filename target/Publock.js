"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageChain_1 = require("./MessageChain");
class Publock {
    constructor(peerjsKey = "2b9dfsp7dv5f80k9", peerId = "", messageChain = new MessageChain_1.MessageChain()) {
        this.messageChain = messageChain;
        if (peerId != "")
            this.connectToPeer(peerId);
    }
    get messageChain() {
        return this._messageChain;
    }
    set messageChain(newMessageChain) {
        this._messageChain = newMessageChain;
    }
    // Methods
    initConnection(peerjsKey) {
    }
    connectToPeer(peerId) {
    }
    dataReceived(connectionId, data) {
        console.log(connectionId + " sent: " + data);
    }
    sendData(connectionId, data) {
    }
}
exports.Publock = Publock;
