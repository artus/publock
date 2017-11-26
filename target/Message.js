"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NodeRSA = require("node-rsa");
const SHA256 = require("crypto-js/sha256");
/**
* A message object represents an entry for a MessageChain.
*/
class Message {
    /**
    * Initialise a new Message.
    *
    * @param {string} pseudonym - The pseudonym to be used for this message.
    * @param {string} body - The message body.
    * @param {string} date - The datestring for this message.
    * @param {string} reference - The hash of the message referenced by this message.
    * @param {string} previousHash - The hash of the newest entry of the MessageChain.
    * @param {string} publicKey - The public key associated with this pseudonym.
    * @param {string} encryptedHash - The hash of all the above fields, encrypted with the private key corresponding to the given public key.
    * @param {string} hash - The hash of this message, hashed from all the above fields.
    */
    constructor(pseudonym = "", body = "", date = "", reference = "", previousHash = "", publicKey = "", encryptedHash = "", hash = "") {
        this.pseudonym = pseudonym;
        this.body = body;
        this.date = date;
        this.reference = reference;
        this.previousHash = previousHash;
        this.publicKey = publicKey;
        this.encryptedHash = encryptedHash;
        this.hash = hash;
    }
    get encryptedHashFields() {
        return this.pseudonym + this.body + this.date + this.reference + this.previousHash + this.publicKey;
    }
    get innerHash() {
        return SHA256(this.encryptedHashFields).toString();
    }
    get allFields() {
        return this.pseudonym + this.body + this.date + this.reference + this.previousHash + this.publicKey + this.encryptedHash + this.hash;
    }
    generateEncryptedHash(privateKey) {
        let key = new NodeRSA({ b: 512 });
        key.importKey(privateKey, 'private');
        let hash = this.innerHash;
        let encryptedHash = key.encryptPrivate(hash, 'base64');
        return encryptedHash;
    }
    generateHash() {
        return SHA256(this.allFields).toString();
    }
}
exports.Message = Message;
