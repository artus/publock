import { Message } from './Message';
import { MessageChain } from './MessageChain';

import SimplePeer = require('simple-peer');
import wrtc = require('wrtc');

export class Publock
{
    private _messageChain;
    
    public connections : Map<string, SimplePeer>;
    
    public offeringConnection : SimplePeer;
    public answeringConnection : SimplePeer;
    
    public offer : string;
    public answer : string;
    
    public logging : boolean;
    
    constructor(logging : boolean = true, messageChain : MessageChain = new MessageChain(), )
    {
        this.logging = logging;
        this.messageChain = messageChain;
        this.connections = new Map<string, SimplePeer>();
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
        let newPeer = new SimplePeer({ initiator : true, wrtc: wrtc, trickle: false});
        
        newPeer.on('signal', data => {
            this.offer = JSON.stringify(data);
        });
        
        newPeer.on('connect', () => {
            this.connections.set(newPeer._id, newPeer);
            this.initialiseOfferingConnection();
        });
        
        newPeer.on('data', data => {
            this.dataReceived(newPeer._id, data);
        });
        
        newPeer.on('error', error => {
            console.log(error);
            newPeer.destroy();
        });
        
        this.offeringConnection = newPeer;
        this.log("Offering connection initialised.");
    }
    
    initialiseAnsweringConnection()
    {
        let newPeer = new SimplePeer({ wrtc: wrtc, trickle: false });
        
        newPeer.on('signal', data => {
            this.answer = JSON.stringify(data);
        });
        
        newPeer.on('connect', () => {
            this.connections.set(newPeer._id, newPeer);
            this.initialiseAnsweringConnection();
        });
        
        newPeer.on('data', data => {
            this.dataReceived(newPeer._id, data);
        });
        
        newPeer.on('error', error => {
            console.log(error);
            newPeer.destroy();
        });
        
        this.answeringConnection = newPeer;
        this.log("Answering connection initialised.");
    }
    
    answerConnection(offer : string)
    {
        this.answeringConnection.signal(JSON.parse(offer));
    }
    
    connectToPeer(answer: string)
    {
        this.offeringConnection.signal(JSON.parse(answer));
    }
        
    dataReceived(connectionId: string, data : string)
    {
        console.log(connectionId + " sent: " + data);
    }
    
    sendData(connectionId : string, data : string)
    {
        this.connections.get(connectionId).send(data);
    }
    
    log(message : string)
    {
        if (this.logging) console.log(message);
    }
}