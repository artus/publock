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
    public readonly genesisHash = "b15d3f419806cf820e96a36cf0162aa14d5465985a8e99fccd27e9e70c3d29f6";
    
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
    
    get lastMessage() : Message
    {
        return this.messageList[this.messageList.length -1];
    }
    
    get size() : number
    {
        return this.messageMap.size;
    }

    private addGenesisBlock()
    {
        let message = new Message("Genesis", "This is the first message on the MessageChain.", "2017-11-25T12:00:00.000Z", "", "", "-----BEGIN PUBLIC KEY-----\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMS+fJ0hAKDQZH7SdWuR1Qr/Pxha2zfO\nVfme3QLIiTWgZIK4NxY/XZrIWvVE/FE+8C8PajqqPUhkGTlcV4drQn8CAwEAAQ==\n-----END PUBLIC KEY-----", "uix+ieQpgDWOyJZABPM4nNquZvqLyAJqVbik4j4C/4iGqDOaI+vplu4X4hsjEPLzwmAudAwPW0VF3EN5VcN6bkkyGk+T4u4o639ku0no1hTiWKIjexaaglpVccIa6dgF7oBAQPRBNI8vGWs7UOkaHFpcetfTPpgZ9Hfqsjgjm0yuFnZ34YN5goBj5iR5fX/nDq2wmPHunXZ3sSLE/JaePO/zOMCj3dy8b04/r98XUpr7aMXJeKE/8bcck1mXIzgz", "b15d3f419806cf820e96a36cf0162aa14d5465985a8e99fccd27e9e70c3d29f6");
        this._messageList.push(message);
        this._messageMap.set(message.hash, message);
    }
    
    public containsMessageWithHash(hash : string) : boolean
    {
        return typeof this.messageMap.get(hash) != 'undefined';
    }

    public addMessage(newMessage : Message)
    {
        this.isValidMessage(newMessage);
        this._messageMap.set(newMessage.hash, newMessage);
        this._messageList.push(newMessage);
    }
    
    public getPseudonymFirstOccurence(pseudonym : string) : Message
    {
        for (let message of this.messageList)
        {
            if (message.pseudonym == pseudonym) return message;
        }
    }
    
    public validateMessageChain() : boolean
    {
        // Check if there are the same amount of messages in the messageList and the messageMap.
        if (this.messageList.length != this.messageMap.size) return false;
        
        
        // Initialise the first message, check if it is the genesisBlock;
        let previousMessage = this.messageList[0];
        
        if (previousMessage.hash != this.genesisHash) throw new Error("Genesis hash is not equal to original genesishash.");
        if (previousMessage.generateHash() != this.genesisHash) throw new Error("Genesis fields are not valid.");
        
        for (let i = 1; i < this.messageList.length; i++)
        {
            let currentMessage = this.messageList[i];
            
            // Check if previousHash is correct
            if (currentMessage.previousHash != previousMessage.hash) throw new Error("Message with hash " + currentMessage.hash + " previousHash field is not correct.");
            
            
            // Check if date is after previousMessage date
            let currentDate = new Date(currentMessage.date);
            let previousDate = new Date(previousMessage.date);
            
            if (currentDate < previousDate) throw new Error("Message with hash " + currentMessage.hash + " date field contains a date that is before the previousMessage date field.");
            
            // Check if date is not in the future
            if (new Date() < currentDate) Error("Message with hash " + currentMessage.hash + " date field contains a date in the future.");
            
            
            // If the message refers to another message, check if that message exists
            if (currentMessage.reference != "")
            {
                let referencedMessage = this.messageMap.get(currentMessage.reference);
                if (typeof referencedMessage == 'undefined') throw new Error("Message with hash " + currentMessage.hash + " references an non existing Message.");
            }
            
            
            // If the pseudonym has been used in the past, check if the public key matches
            let firstOccurence = this.getPseudonymFirstOccurence(currentMessage.pseudonym);
            
            if (typeof firstOccurence != 'undefined')
            {
                if (currentMessage.publicKey != firstOccurence.publicKey) throw new Error("Message with hash " + currentMessage.hash + " pseudonym has been used before with another public key.");
            }
            
            // Check if the encrypted hash is correct.
            let key = new NodeRSA({b: 512});
            key.importKey(currentMessage.publicKey, 'public');
            let decryptedHash = key.decryptPublic(currentMessage.encryptedHash, 'utf8');
            
            if (decryptedHash != currentMessage.innerHash) throw new Error("Message with hash " + currentMessage.hash + " ecnryptedHash is not valid.");
            
            
            // Check if the hash is correct
            let calculatedHash = currentMessage.generateHash();
            if (currentMessage.hash != calculatedHash) throw new Error("Message with hash " + currentMessage.hash + " has an invalid hash.");
            
            
            // Set the previousMessage to the currentMessage
            previousMessage = currentMessage;
        }
        
        return true;
    }
    
    isValidMessage(message : Message) : boolean
    {
        // First, validate MessageChain
        this.validateMessageChain();
        
        
        // Check if the previousHash field is correct
        if (message.previousHash != this.lastMessage.hash) throw new Error("New message previousHash field does not reference the latest Message in the MessageChain.");
        
        
        // Check if the date field is newer than the date of the most recent Message in the MessageChain.
        let newDate = new Date(message.date);
        let previousDate = new Date(this.lastMessage.date);
        if (newDate < previousDate) throw new Error("New Message date field contains date that is older than the date of the most recent Message in the MessageChain.");
        
        // Check if the date field is older than the current Date
        if (newDate > new Date()) throw new Error("New Message date field contains a date that is older than the curent date.");
        
        
        // Check if the pseudonym has already been used before. If it does, check if the public keys compare.
        let firstOccurence = this.getPseudonymFirstOccurence(message.pseudonym);
        if (typeof firstOccurence != 'undefined')
        {
            if (message.publicKey != firstOccurence.publicKey) throw new Error("Pseudonym has already been used before with another public key.");
        }
        
        
        // Check if the encryptedHash field is correct
        let key = new NodeRSA({b: 512});
        key.importKey(message.publicKey, 'public');
        let decryptedHash = key.decryptPublic(message.encryptedHash, 'utf8');
        
        if (decryptedHash != message.innerHash) throw new Error("New Message encryptedHash field contains an incorrect hash.");
        
        
        // Check if the hash is correct
        if (message.hash != message.generateHash()) throw new Error("New Message hash field contains incorrect hash.");
        
        return true;
    }
    
    public static copyMessageChain(otherMessageChain : MessageChain) : MessageChain
    {
        let newMessageChain = new MessageChain();
        
        for (let otherMessage of otherMessageChain.messageList)
        {
            // Check if otherMessage isn't the genesis block
            if (otherMessage.hash != newMessageChain.genesisHash)
            {
                let newMessage = Message.copyMessage(otherMessage);
                newMessageChain.addMessage(newMessage);
            }
        }
        
        return newMessageChain;
    }
}