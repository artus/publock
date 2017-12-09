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
    
    public connections : Map<string, Publock>;
    
    public logging : boolean;
    
    constructor(logging : boolean = false, messageChain : MessageChain = new MessageChain())
    {
        this.id = (Publock.idCounter++).toString();
        this.logging = logging;
        this.messageChain = messageChain;
        this.connections = new Map<string, Publock>();
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
    
    joinPublock(publock : Publock)
    {
        // TODO
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
}
    