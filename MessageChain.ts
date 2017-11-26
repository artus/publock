import { Message } from './Message';
import NodeRSA = require('node-rsa');
import SHA256 = require('crypto-js/sha256');

/**
* A MessageChain is a chain of messages linked together by hashes. Adding messages is possible.
*/
export class MessageChain
{ 
    private _messageMap : Map<string, Message>;
    private _messageList : Array<Message>;
    
    private genesisString = '{"pseudonym":"Genesis","body":"This is the first message on the MessageChain.","date":"2017-11-25T12:00:00.000Z","reference":"","previousHash":"","publicKey":"-----BEGIN PUBLIC KEY-----\\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMS+fJ0hAKDQZH7SdWuR1Qr/Pxha2zfO\\nVfme3QLIiTWgZIK4NxY/XZrIWvVE/FE+8C8PajqqPUhkGTlcV4drQn8CAwEAAQ==\\n-----END PUBLIC KEY-----","encryptedHash":"uix+ieQpgDWOyJZABPM4nNquZvqLyAJqVbik4j4C/4iGqDOaI+vplu4X4hsjEPLzwmAudAwPW0VF3EN5VcN6bkkyGk+T4u4o639ku0no1hTiWKIjexaaglpVccIa6dgF7oBAQPRBNI8vGWs7UOkaHFpcetfTPpgZ9Hfqsjgjm0yuFnZ34YN5goBj5iR5fX/nDq2wmPHunXZ3sSLE/JaePO/zOMCj3dy8b04/r98XUpr7aMXJeKE/8bcck1mXIzgz","hash":"b15d3f419806cf820e96a36cf0162aa14d5465985a8e99fccd27e9e70c3d29f6"}';
    
    constructor()
    {
        this._messageMap = new Map<string, Message>();
        this._messageList = new Array<Message>();
        
        this.addGenesisBlock();
    }
    
    get messageMap() : Map<string, Message>
    {
        return this._messageMap;
    }
    
    get messageList() : Array<Message>
    {
        return this._messageList;
    }

    private addGenesisBlock()
    {
        let message = new Message("Genesis", "This is the first message on the MessageChain.", "2017-11-25T12:00:00.000Z", "", "", "-----BEGIN PUBLIC KEY-----\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMS+fJ0hAKDQZH7SdWuR1Qr/Pxha2zfO\nVfme3QLIiTWgZIK4NxY/XZrIWvVE/FE+8C8PajqqPUhkGTlcV4drQn8CAwEAAQ==\n-----END PUBLIC KEY-----", "uix+ieQpgDWOyJZABPM4nNquZvqLyAJqVbik4j4C/4iGqDOaI+vplu4X4hsjEPLzwmAudAwPW0VF3EN5VcN6bkkyGk+T4u4o639ku0no1hTiWKIjexaaglpVccIa6dgF7oBAQPRBNI8vGWs7UOkaHFpcetfTPpgZ9Hfqsjgjm0yuFnZ34YN5goBj5iR5fX/nDq2wmPHunXZ3sSLE/JaePO/zOMCj3dy8b04/r98XUpr7aMXJeKE/8bcck1mXIzgz", "b15d3f419806cf820e96a36cf0162aa14d5465985a8e99fccd27e9e70c3d29f6");
        this._messageList.push(message);
        this._messageMap.set(message.hash, message);
    }

    public addMessage(newMessage : Message)
    {
        this._messageMap.set(newMessage.hash, newMessage);
        this._messageList.push(newMessage);
    }
}