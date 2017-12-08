export interface IPeer
{
    id : string;
    
    offerConnection(param : any) : string;
    answerConnection(param : any) : string;
    
    sendData(peer : IPeer, data : string) : string;
    
    onSentData() : string;
    onReceivedData() : string;
    
    onError() : string;
    onSignal() : string;
}