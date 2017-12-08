import { Event } from 'typescript.events';

export interface IPeer
{
    id : string;
    
    on(eventName : any, handler : any);
    
    offerConnection(param : any) : any;
    answerConnection(param : any) : any;
    
    sendData(param : any) : any;
    receiveData(param : any) : any;
    
    onConnected(param : any) : any;
    onDisconnected(param : any) : any;
    
    onSentData(param : any) : any;
    onReceivedData(param : any) : any;
    
    onError(param : any) : any;
    onSignal(param : any) : any;
}