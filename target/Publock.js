"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("./Message");
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
            connection.removeConnectionsToPublock(this);
        }
        this.connections = new Map();
    }
    removeConnectionsToPublock(publock) {
        if (this.isConnectedToPublock(publock.id)) {
            this.connections.delete(publock.id);
            for (let connection of this.connections.values()) {
                connection.removeConnectionsToPublock(publock);
            }
        }
    }
    kickPublockFromNetwork(publock) {
        publock.disconnect();
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
    validateMessage(message) {
        if (this.messageChain.lastMessage.equals(message))
            return true;
        try {
            return this.messageChain.isValidMessage(message);
        }
        catch (error) {
            return false;
        }
    }
    validateMessageForPublock(message, publock) {
        return publock.validateMessage(message);
    }
    retrieveConsensusMapForMessage(message) {
        let consensusMap = new Map();
        for (let connection of this.connections.values()) {
            consensusMap.set(connection.id, connection.validateMessage(message));
        }
        return consensusMap;
    }
    reachConsensusForMessage(message) {
        let consensusCount = 0;
        for (let isValid of this.retrieveConsensusMapForMessage(message)) {
            if (isValid)
                consensusCount++;
        }
        return consensusCount >= this.connections.size;
    }
    addNewMessage(pseudonym, body, reference, key) {
        let newMessage = new Message_1.Message(pseudonym, body, new Date().toISOString(), reference, this.messageChain.lastMessage.hash, key.exportKey('public'));
        newMessage.encryptedHash = newMessage.generateEncryptedHash(key.exportKey('private'));
        newMessage.hash = newMessage.generateHash();
        return this.addMessageToNetwork(newMessage);
    }
    addMessageToNetwork(message) {
        if (!this.messageChain.lastMessage.equals(message)) {
            if (this.reachConsensusForMessage(message)) {
                this.messageChain.addMessage(Message_1.Message.copyMessage(message));
                for (let connection of this.connections.values()) {
                    connection.addMessageToNetwork(message);
                }
            }
        }
        return message;
    }
}
Publock.idCounter = 0;
exports.Publock = Publock;
