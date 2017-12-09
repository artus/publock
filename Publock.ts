import { Message } from './Message';
import { MessageChain } from './MessageChain';

export class Publock
{
    readonly id : string;
    readonly version : string = "1";
    
    public static idCounter = 0;
    
    public messageChain;
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
            connection.kickPublockFromNetwork(this);
        }
        
        this.connections = new Map<string, Publock>();
    }
    
    kickPublockFromNetwork(publock : Publock)
    {
        if (this.isConnectedToPublock(publock.id))
        {
            this.connections.delete(publock.id);
            
            for (let connection of this.connections.values())
            {
                connection.kickPublockFromNetwork(publock);
            }
        }
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
}
    