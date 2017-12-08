import { Message } from './Message';
import { MessageChain } from './MessageChain';

import { IPeer } from './IPeer';
import { PeerStub } from './PeerStub';

export class Publock
{
    private _messageChain;
    
    public connections : Map<string, IPeer>;
    
    public offeringConnection : IPeer;
    public answeringConnection : IPeer;
    
    public logging : boolean;
    
    constructor(logging : boolean = false, messageChain : MessageChain = new MessageChain())
    {
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
        let offeringPeer = new PeerStub();
        
        offeringPeer.on('connected', (peer) => {
            this.connections.set(offeringPeer.id, offeringPeer);
            this.log("connected with peer " + peer.id);
        });
                        
        offeringPeer.on('disconnected', (peer) => {
            this.connections.delete(offeringPeer.id);
            this.log("disconnected with peer " + peer.id);
        });
        
        offeringPeer.on('data-received', (data) => this.dataReceived(offeringPeer.otherPeer.id, data));
        offeringPeer.on('data-sent', (data) => this.log("sent data:" + data) );
        
        this.offeringConnection = offeringPeer;
    }
    
    initialiseAnsweringConnection()
    {
        let answeringPeer = new PeerStub();
        
        answeringPeer.on('connected', (peer) => {
            this.connections.set(answeringPeer.id, answeringPeer);
            this.log("connected with peer " + peer.id);
        });
                        
        answeringPeer.on('disconnected', (peer) => {
            this.connections.delete(answeringPeer.id);
            this.log("disconnected with peer " + peer.id);
        });
        
        answeringPeer.on('data-received', (data) => this.dataReceived(answeringPeer.otherPeer.id, data));
        answeringPeer.on('data-sent', (data) => this.log("sent data:" + data) );
        
        this.answeringConnection = answeringPeer;
    }
    
    answerConnection(offer : any)
    {
        this.answeringConnection.answerConnection(offer);
    }
    
    connectToPeer(answer: any)
    {
        this.offeringConnection.offerConnection(answer);
    }
        
    dataReceived(connectionId: string, data : string)
    {
        this.log(connectionId + ": " + data);
    }
    
    sendData(connectionId : string, data : string)
    {
        this.connections.get(connectionId).sendData(data);
    }
    
    log(message : string)
    {
        if (this.logging) console.log(message);
    }
}