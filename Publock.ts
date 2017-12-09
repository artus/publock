import { Message } from './Message';
import { MessageChain } from './MessageChain';

import NodeRSA = require('node-rsa');

export class Publock
{
    readonly id : string;
    readonly version : string = "1";
    
    public static idCounter = 0;
    
    public messageChain : MessageChain;
    private messageChainLoaded = false;
    
    public connections : Map<string, Publock>;
    
    public logging : boolean;
    
    constructor(logging : boolean = false, messageChain : MessageChain = new MessageChain())
    {
        this.id = (Publock.idCounter++).toString();
        this.logging = logging;
        this.messageChain = messageChain;
        this.connections = new Map<string, Publock>();
    }
    
    // Methods
    
    joinPublockNetworkFrom(publock : Publock)
    {
        this.connectToPublock(publock);
        this.loadMessageChainFromPublock(publock);
    }
    
    connectToPublock(publock : Publock)
    {
        if (!this.isConnectedToPublock(publock.id)) 
        {
            this.connections.set(publock.id, publock);
            publock.connections.set(this.id, this);
        }
        
        for (let connection of publock.connections.values())
        {
            if (!this.isConnectedToPublock(connection.id)) this.connectToPublock(connection);
        }
    }
    
    disconnect()
    {
        for (let connection of this.connections.values())
        {
            connection.removeConnectionsToPublock(this);
        }
        
        this.connections = new Map<string, Publock>();
    }
    
    removeConnectionsToPublock(publock : Publock)
    {
        if (this.isConnectedToPublock(publock.id))
        {
            this.connections.delete(publock.id);
            
            for (let connection of this.connections.values())
            {
                connection.removeConnectionsToPublock(publock);
            }
        }
    }
    
    kickPublockFromNetwork(publock : Publock)
    {
        publock.disconnect();
    }
    
    loadMessageChainFromPublock(publock : Publock)
    {
        if (this.messageChainLoaded) throw new Error("Publock with id " + this.id + " already has loaded a MessageChain.");
        this.messageChain = MessageChain.copyMessageChain(publock.messageChain);
    }
    
    log(message : string)
    {
        if (this.logging) console.log(message);
    }
    
    isConnectedToPublock(publockId : string) : boolean
    {
        for (let connection of this.connections.values())
        {
            if (this.id == publockId || connection.id == publockId) return true;
        }
        return false;
    }
    
    validateMessage(message : Message) : boolean
    {
        if (this.messageChain.lastMessage.equals(message)) return true;
        try {
            return this.messageChain.isValidMessage(message);
        } catch(error) {
            return false;
        }
    }
    
    validateMessageForPublock(message : Message, publock : Publock) : boolean
    {
        return publock.validateMessage(message);
    }
    
    retrieveConsensusMapForMessage(message : Message) : Map<string, boolean>
    {
        let consensusMap = new Map<string, boolean>();
        
        for (let connection of this.connections.values())
        {
            consensusMap.set(connection.id, connection.validateMessage(message));
        }
        
        return consensusMap;
    }
    
    reachConsensusForMessage(message : Message) : boolean
    {
        let consensusCount = 0;
        
        for (let isValid of this.retrieveConsensusMapForMessage(message))
        {
            if (isValid) consensusCount++;
        }
        
        return consensusCount >= this.connections.size;
    }
    
    addNewMessage(pseudonym : string, body : string, reference : string, key : NodeRSA) : Message
    {
        let newMessage = new Message(pseudonym, body, new Date().toISOString(), reference, this.messageChain.lastMessage.hash, key.exportKey('public'));
        newMessage.encryptedHash = newMessage.generateEncryptedHash(key.exportKey('private'));
        newMessage.hash = newMessage.generateHash();
        
        return this.addMessageToNetwork(newMessage);
    }
    
    addMessageToNetwork(message : Message) : Message
    {
        if (!this.messageChain.lastMessage.equals(message))
        {
            if (this.reachConsensusForMessage(message))
            {
                this.messageChain.addMessage(Message.copyMessage(message));
                
                for (let connection of this.connections.values())
                {
                    connection.addMessageToNetwork(message);
                }
            }
        }
        
        return message;
    }
}
    