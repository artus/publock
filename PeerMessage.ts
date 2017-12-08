export class PeerMessage
{
    command : string;
    data : any;
    
    constructor(command : string, data : any)
    {
        this.command = command;
        this.data = data;
    }
}