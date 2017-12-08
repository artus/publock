import { IPeer } from './IPeer';
import { Event } from 'typescript.events';

export class PeerStub extends Event implements IPeer
{
    id : string;
    private static idCounter : number = 0;
    
    publockId : string;
    
    public otherPeer : IPeer;
    
    constructor(publockId : string)
    {
        super();
        this.publockId = publockId;
        this.id = (PeerStub.idCounter++).toString();
    }
    
    offerConnection(param : any) : PeerStub
    {
        this.otherPeer = param;
        param.answerConnection(this);
        this.onConnected();
        return this;
    }
    
    answerConnection(otherPeer : PeerStub)
    {
        this.otherPeer = otherPeer;
        this.onConnected();
    }
    
    onConnected() : string
    {
        this.emit('connected', this.otherPeer);
        return "connected with peer " + this.otherPeer.id;
    }
    
    onDisconnected() : string
    {
        this.emit('disconnected', this.otherPeer);
        return "disconnected from peer " + this.otherPeer.id;
    }
    
    sendData(data : string)
    {
        try
        {
            this.onSendData(data);
            this.otherPeer.receiveData(data);
        }
        catch (error)
        {
            this.onDisconnected();
        }
    }
    
    receiveData(data : string) : string
    {
        this.onReceivedData(data);
        return data;
    }
    
    disconnect(param : any) : string
    {
        this.otherPeer.onDisconnected("");
        return this.onDisconnected();
    }
    
    onSendData(data : string) : string
    {
        this.emit('data-sent', data);
        return data;
    }
    
    onReceivedData(data : string) : string
    {
        this.emit('data-received', data);
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