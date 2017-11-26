"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("./Message");
const NodeRSA = require("node-rsa");
/**
* A MessageChain is a chain of messages linked together by hashes. Adding messages is possible.
*/
class MessageChain {
    constructor() {
        this.genesis = JSON.parse('{"pseudonym":"Genesis","body":"This is the first message on the MessageChain.","date":"2017-11-25T12:00:00.000Z","reference":"","previousHash":"","publicKey":"-----BEGIN PUBLIC KEY-----\\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMS+fJ0hAKDQZH7SdWuR1Qr/Pxha2zfO\\nVfme3QLIiTWgZIK4NxY/XZrIWvVE/FE+8C8PajqqPUhkGTlcV4drQn8CAwEAAQ==\\n-----END PUBLIC KEY-----","encryptedHash":"uix+ieQpgDWOyJZABPM4nNquZvqLyAJqVbik4j4C/4iGqDOaI+vplu4X4hsjEPLzwmAudAwPW0VF3EN5VcN6bkkyGk+T4u4o639ku0no1hTiWKIjexaaglpVccIa6dgF7oBAQPRBNI8vGWs7UOkaHFpcetfTPpgZ9Hfqsjgjm0yuFnZ34YN5goBj5iR5fX/nDq2wmPHunXZ3sSLE/JaePO/zOMCj3dy8b04/r98XUpr7aMXJeKE/8bcck1mXIzgz","hash":"b15d3f419806cf820e96a36cf0162aa14d5465985a8e99fccd27e9e70c3d29f6"}');
        this._messageMap = new Map();
        this._messageList = new Array();
        this.addGenesisBlock();
    }
    get messageMap() {
        return this._messageMap;
    }
    get messageList() {
        return this._messageList;
    }
    privateGenesisKey() {
        let privateKey = "";
        privateKey += '-----BEGIN RSA PRIVATE KEY-----\n';
        privateKey += 'MIIBOQIBAAJBAMS+fJ0hAKDQZH7SdWuR1Qr/Pxha2zfOVfme3QLIiTWgZIK4NxY/\n';
        privateKey += 'XZrIWvVE/FE+8C8PajqqPUhkGTlcV4drQn8CAwEAAQJARTrWNKBJTU0nH61E3i45\n';
        privateKey += 'rh31AMfvvapgfG7XTERua6y/pZBtcD9LcOLCEr1eezCh+9beYWyoWsOgEBoElIZl\n';
        privateKey += 'gQIhAOzWfMIupdgwlnNxdFGxcQw8veu0QNFmWesFTiOr+wBBAiEA1KmOW91NCezl\n';
        privateKey += 'VIVoovsFFSbqnm/o39bZphuy8eDBkr8CIDKxxoqaCY24+LtFMay62oPQDKcDMkyg\n';
        privateKey += 'J+cSf6NLELMBAiBfF6Zxi4ZcTtLJNZJxdl9ycuFskUwHc3IFZdNhdwf3zwIgdDY6\n';
        privateKey += '4Mx/L/C54y5n25g3D5eZdG/1zLVMdkVhKZUREtY=\n';
        privateKey += '-----END RSA PRIVATE KEY-----';
        return privateKey;
    }
    get publicGenesisKey() {
        let publicKey = "";
        publicKey += '-----BEGIN PUBLIC KEY-----\n';
        publicKey += 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMS+fJ0hAKDQZH7SdWuR1Qr/Pxha2zfO\n';
        publicKey += 'Vfme3QLIiTWgZIK4NxY/XZrIWvVE/FE+8C8PajqqPUhkGTlcV4drQn8CAwEAAQ==\n';
        publicKey += '-----END PUBLIC KEY-----';
        return publicKey;
    }
    addGenesisBlock() {
        let message = new Message_1.Message("Genesis", "This is the first message on the MessageChain.", "2017-11-25T12:00:00.000Z", "", "", "-----BEGIN PUBLIC KEY-----\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMS+fJ0hAKDQZH7SdWuR1Qr/Pxha2zfO\nVfme3QLIiTWgZIK4NxY/XZrIWvVE/FE+8C8PajqqPUhkGTlcV4drQn8CAwEAAQ==\n-----END PUBLIC KEY-----", "uix+ieQpgDWOyJZABPM4nNquZvqLyAJqVbik4j4C/4iGqDOaI+vplu4X4hsjEPLzwmAudAwPW0VF3EN5VcN6bkkyGk+T4u4o639ku0no1hTiWKIjexaaglpVccIa6dgF7oBAQPRBNI8vGWs7UOkaHFpcetfTPpgZ9Hfqsjgjm0yuFnZ34YN5goBj5iR5fX/nDq2wmPHunXZ3sSLE/JaePO/zOMCj3dy8b04/r98XUpr7aMXJeKE/8bcck1mXIzgz", "b15d3f419806cf820e96a36cf0162aa14d5465985a8e99fccd27e9e70c3d29f6");
        this._messageList.push(message);
        this._messageMap.set(message.hash, message);
    }
    addMessage(newMessage) {
        this._messageMap.set(newMessage.hash, newMessage);
        this._messageList.push(newMessage);
    }
}
exports.MessageChain = MessageChain;
let mc = new MessageChain();
let genesis = mc.messageList[0];
let key = new NodeRSA({ b: 512 });
key.importKey(genesis.publicKey, 'public');
console.log(genesis.innerHash);
console.log(key.decryptPublic(genesis.encryptedHash, 'utf8'));
