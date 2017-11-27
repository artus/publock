import { Message } from './Message';
import { MessageChain } from './MessageChain';

export class Publock
{
    private _messageChain;
    
    constructor(peerjsKey : string = "2b9dfsp7dv5f80k9", peerId : string = "", messageChain : MessageChain = new MessageChain(), )
    {
        this.messageChain = messageChain;
        
        if (peerId != "") this.connectToPeer(peerId);
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
    
    initConnection(peerjsKey : string)
    {
    }
    
    connectToPeer(peerId: string)
    {
    }
        
    dataReceived(connectionId: string, data : string)
    {
        console.log(connectionId + " sent: " + data);
    }
    
    sendData(connectionId : string, data : string)
    {
    }
}