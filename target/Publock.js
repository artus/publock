"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageChain_1 = require("./MessageChain");
class Publock {
    constructor(logging = false, messageChain = new MessageChain_1.MessageChain()) {
        this.version = "1";
        this.messageChainLoaded = false;
        this.id = (Publock.idCounter++).toString();
        this.logging = logging;
        this.messageChain = messageChain;
        this.connections = new Map();
    }
    // Methods
    joinPublockNetworkFrom(publock) {
        this.connectToPublock(publock);
        this.loadMessageChainFromPublock(publock);
    }
    connectToPublock(publock) {
        if (!this.isConnectedToPublock(publock.id)) {
            this.connections.set(publock.id, publock);
            publock.connections.set(this.id, this);
        }
        for (let connection of publock.connections.values()) {
            if (!this.isConnectedToPublock(connection.id))
                this.connectToPublock(connection);
        }
    }
    disconnect() {
        for (let connection of this.connections.values()) {
            connection.kickPublockFromNetwork(this);
        }
        this.connections = new Map();
    }
    kickPublockFromNetwork(publock) {
        if (this.isConnectedToPublock(publock.id)) {
            this.connections.delete(publock.id);
            for (let connection of this.connections.values()) {
                connection.kickPublockFromNetwork(publock);
            }
        }
    }
    loadMessageChainFromPublock(publock) {
        if (this.messageChainLoaded)
            throw new Error("Publock with id " + this.id + " already has loaded a MessageChain.");
        this.messageChain = MessageChain_1.MessageChain.copyMessageChain(publock.messageChain);
    }
    log(message) {
        if (this.logging)
            console.log(message);
    }
    isConnectedToPublock(publockId) {
        for (let connection of this.connections.values()) {
            if (this.id == publockId || connection.id == publockId)
                return true;
        }
        return false;
    }
}
Publock.idCounter = 0;
exports.Publock = Publock;
