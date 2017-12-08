import { IPeer } from './IPeer';

export class PeerStub implements IPeer
{
    private _id : string;
    
    get id() : string
    {
        return this._id;
    }
    
    set id(newId : string)
    {
        this._id = newId;
    }
    
    offerConnection()
    {
        return this;
    }
    
    answerConnection(offer : string)
    {
        
    }
    
    sendData(peer : IPeer, data : string)
    {
        
    }
    
    receiveData(peer : Ipeer, data : string)
    
    onSentData() : string
    {
        // Do nothing
        return "";
    }
    
    onReceivedData() : string
    {
        return "";
    }


}