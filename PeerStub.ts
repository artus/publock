import { IPeer } from './IPeer';
import { Event } from 'typescript.events';

export class PeerStub extends Event implements IPeer
{
    id : string;
    private static idCounter : number = 0;
    
    private otherPeer : PeerStub;
    
    constructor()
    {
        super();
        this.id = (PeerStub.idCounter++).toString();
    }
    
    offerConnection(param : any) : PeerStub
    {
        return this;
    }
    
    answerConnection(otherPeer : PeerStub)
    {
        this.otherPeer = otherPeer;
        this.onConnected();
    }
    
    onConnected() : string
    {
        this.emit('connected');
        return "connected with peer " + this.otherPeer.id;
    }
    
    onDisconnected() : string
    {
        return "disconnected from peer " + this.otherPeer.id;
    }
    
    sendData(data : string)
    {
        this.otherPeer.receiveData(data);
    }
    
    receiveData(data : string)
    {
        this.emit
    }
    
    onSentData(data : string) : string
    {
        this.emit('send-data', data);
        return data;
    }
    
    onReceivedData(data : string) : string
    {
        this.emit('received-data', data);
        return data;
    }

    onError(error : string) : string
    {
        this.emit('error', error);
        return error;
    }
    
    onSignal(signal : string) : string
    {
        this.emit('signal', signal);
        return signal;
    }

}