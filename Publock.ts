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
    
    public idCounter : number = 0;
    
    constructor(messageChain : MessageChain = new MessageChain(), )
    {
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
        let newPeer = new SimplePeer({ initiator : true, wrtc: wrtc});
        
        newPeer.on('signal', data => {
            this.offer = JSON.stringify(data);
        });
        
        newPeer.on('connect', () => {
            this.connections.set(newPeer._id, newPeer);
            this.initialiseOfferingConnection();
        });
        
        newPeer.on('data', data => {
            this.dataReceived(this.connections.get(newPeer._id), data);
        });
        
        newPeer.on('error', error => {
            console.log(error);
            newPeer.destroy();
        });
        
        this.offeringConnection = newPeer;
    }
    
    initialiseAnsweringConnection()
    {
        let newPeer = new SimplePeer({ wrtc: wrtc });
        
        newPeer.on('signal', data => {
            this.answer = JSON.stringify(data);
        });
        
        newPeer.on('connect', () => {
            this.connections.set(newPeer._id, newPeer);
            this.initialiseAnsweringConnection();
        });
        
        newPeer.on('data', data => {
            this.dataReceived(this.connections.get(newPeer._id), data);
        });
        
        newPeer.on('error', error => {
            console.log(error);
            newPeer.destroy();
        });
        
        this.answeringConnection = newPeer;
    }
    
    answerConnection(offer : string)
    {
        this.answeringConnection.signal(offer);
    }
    
    connectToPeer(answer: string)
    {
        this.offeringConnection.signal(answer);
    }
        
    dataReceived(connectionId: string, data : string)
    {
        console.log(connectionId + " sent: " + data);
    }
    
    sendData(connectionId : string, data : string)
    {
        this.connections.get(connectionId).send(data);
    }
}

/*let p1 = new SimplePeer({ initiator: true, wrtc: wrtc});
let p2 = new SimplePeer({ wrtc: wrtc });

console.log("created peers.");

p1.on('error', err => console.log('error', err));
p2.on('error', err => console.log('error', err));

console.log("errors bound.");

p1.on('data', data => { 
    console.log("p1 received:" + data);
    p2.destroy();
    p1.destroy();
});
p2.on('data', data => console.log("p2 received:" + data));

console.log("data bound");


p1.on('connect', () => console.log("P1 connected to something"));
p2.on('connect', () => {
    console.log("P2 connected to something");
    p2.send("test");
});

console.log("connection bound");

p1.on('signal', data => {
    console.log("p1._id: " + p1._id);
    p2.signal(data);
});
p2.on('signal', data => {
    console.log("p2._id: " + p2._id);
    p1.signal(data);
})


console.log("signal bound");*/