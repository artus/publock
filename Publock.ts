import { Message } from './Message';
import { MessageChain } from './MessageChain';

import { IPeer } from './IPeer';
import { PeerStub } from './PeerStub';
import { PeerMessage } from './PeerMessage';

export class Publock
{
    readonly id : string;
    public static idCounter = 0;
    
    private _messageChain;
    private messageChainLoaded = false;
    
    public connections : Map<string, IPeer>;
    
    public offeringConnection : IPeer;
    public answeringConnection : IPeer;
    
    public logging : boolean;
    
    constructor(logging : boolean = false, messageChain : MessageChain = new MessageChain())
    {
        this.id = (Publock.idCounter++).toString();
        this.logging = logging;
        this.messageChain = messageChain;
        this.connections = new Map<string, IPeer>();
        this.initialiseOfferingConnection();
        this.initialiseAnsweringConnection();
    }
    
    get messageChain() : MessageChain
    {
        return this._messageChain;
    }
    
    set messageChain(newMessageChain : MessageChain)
    {
        this._messageChain = newMessageChain;
    }
    
    // Methods
    
    initialiseOfferingConnection()
    {
        let offeringPeer = new PeerStub(this.id);
        
        offeringPeer.on('connected', (peer) => {
            this.connections.set(offeringPeer.id, offeringPeer);
            this.log(this.id + ":" + offeringPeer.id + " connected to " + offeringPeer.otherPeer.publockId + ":" + offeringPeer.otherPeer.id);
            
            let connectionId = offeringPeer.id;
            
            this.initialiseOfferingConnection();
        });
                        
        offeringPeer.on('disconnected', (peer) => {
            this.connections.delete(offeringPeer.id);
            this.log(this.id + " : " + offeringPeer.id + " disconnected from " + offeringPeer.otherPeer.publockId + " : " + offeringPeer.otherPeer.id);
        });
        
        offeringPeer.on('data-received', (data) => this.dataReceived(offeringPeer.id, data));
        offeringPeer.on('data-sent', (data) => {} );
        
        this.offeringConnection = offeringPeer;
    }
    
    initialiseAnsweringConnection()
    {
        let answeringPeer = new PeerStub(this.id);
        
        answeringPeer.on('connected', (peer) => {
            this.connections.set(answeringPeer.id, answeringPeer);
            this.log(this.id + ":" + answeringPeer.id + " connected to " + answeringPeer.otherPeer.publockId + ":" + answeringPeer.otherPeer.id);
            
            this.initialiseAnsweringConnection();
        });
                        
        answeringPeer.on('disconnected', (peer) => {
            this.connections.delete(answeringPeer.id);
            this.log(this.id + ":" + answeringPeer.id + " disconnected from " + answeringPeer.otherPeer.publockId + ":" + answeringPeer.id);
        });
        
        answeringPeer.on('data-received', (data) => this.dataReceived(answeringPeer.id, data));
        answeringPeer.on('data-sent', (data) => {} );
        
        this.answeringConnection = answeringPeer;
    }
    
    answerConnection(offer : any)
    {
        this.answeringConnection.answerConnection(offer);
    }
    
    connectToPeer(answer: any)
    {
        if (!this.isConnectedToPublock(answer.publockId))
        this.offeringConnection.offerConnection(answer);
    }
        
    dataReceived(connectionId: string, data : any)
    {
        //this.log(connectionId + ": " + data);
        this.messageParser(connectionId, data);
    }
    
    disconnectPeer(connectionId : string)
    {
        this.connections.get(connectionId).disconnect(undefined);
    }
    
    sendData(connectionId : string, message : PeerMessage)
    {
        this.connections.get(connectionId).sendData(message);
    }
    
    log(message : string)
    {
        if (this.logging) console.log(message);
    }
    
    messageParser(connectionId : string, message : PeerMessage)
    {
        switch (message.command)
        {
            case "connect-to-peer":
                this.connectToPeer(message.data);
            break;
                
            case "answer-peer":
                this.answerConnection(message.data);
            break;
                
            case "load-my-messagechain":
                this.loadMessageChainFromPeer(message.data);
            break;
                
            case "send-your-messagechain":
                this.sendMessageChainToPeer(message.data);
            break;
                
            case "my-connection-list":
                this.connectToConnectionList(connectionId, message.data)
            break;
                
            case "send-offer-to-publock":
                this.sendOfferToPublock(message.data.publockId, message.data.offer);
            break;
                
            case "my-answering-connection":
            break;
        }
    }
    
    isConnectedToPublock(publockId : string) : boolean
    {
        for (let connection of this.connections.values())
        {
            if (connection.otherPeer.publockId == publockId) return true;
        }
        return false;
    }
    
    getConnectionIdByPublockId(publockId : string)
    {
        for (let connection of this.connections.values())
        {
            if (connection.otherPeer.publockId == publockId) return connection.id;
        }
        return (-1).toString();
    }
    
    getPublockIdByConnectionId(connectionId : string)
    {
        for (let connection of this.connections.values())
        {
            if (connection.id == connectionId) return connection.otherPeer.publockId;
        }
        return (-1).toString();
    }
    
    connectToConnectionList(connectionId : string, publockList : Set<string>)
    {
        for (let publockId of publockList)
        {
            if (!this.isConnectedToPublock(publockId))
            {
                let message = new PeerMessage("send-offer-to-publock", { publockId : publockId, offer : this.offeringConnection} );
                this.sendData(connectionId, message);
            }
        }
    }
    
    sendOfferToPublock(publockId : string, offer : any)
    {
        if (this.isConnectedToPublock(publockId))
        {
            let message = new PeerMessage("answer-peer", offer);
            let connectionId = this.getConnectionIdByPublockId(publockId);
            this.sendData(connectionId, message);
        }
    }
    
    loadMessageChainFromPeer(messageChain : MessageChain)
    {
        if (!this.messageChainLoaded) this.messageChain = messageChain;
        this.messageChainLoaded = true;
    }
    
    sendMessageChainToPeer(connectionId : string)
    {
        let newPeerMessage = new PeerMessage("load-my-messagechain", this.messageChain);
        
        this.sendData(connectionId, newPeerMessage);
    }
}