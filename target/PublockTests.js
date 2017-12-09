"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Publock_1 = require("./Publock");
function functionalityWorks(message, result) {
    console.log(result + ": " + message);
}
function creating_a_new_publock_works() {
    let newPublock = new Publock_1.Publock();
    let hasId = typeof newPublock.id != 'undefined';
    let hasMessageChain = typeof newPublock.messageChain != 'undefined';
    let hasConnections = typeof newPublock.connections != 'undefined';
    // Concat booleans
    let result = hasId && hasMessageChain && hasConnections;
    functionalityWorks("Creating a new publock works.", result);
}
creating_a_new_publock_works();
function connecting_to_other_publock_works() {
    let p1 = new Publock_1.Publock();
    let p2 = new Publock_1.Publock();
    let p3 = new Publock_1.Publock();
    let p4 = new Publock_1.Publock();
    let p5 = new Publock_1.Publock();
    let p6 = new Publock_1.Publock();
    let p7 = new Publock_1.Publock();
    let connectionAmount = 6;
    p1.joinPublockNetworkFrom(p2);
    p3.joinPublockNetworkFrom(p1);
    p4.joinPublockNetworkFrom(p3);
    p5.joinPublockNetworkFrom(p2);
    p6.joinPublockNetworkFrom(p5);
    p7.joinPublockNetworkFrom(p1);
    let p1IsConnected = p1.connections.size == connectionAmount;
    let p2IsConnected = p2.connections.size == connectionAmount;
    let p3IsConnected = p3.connections.size == connectionAmount;
    let p4IsConnected = p4.connections.size == connectionAmount;
    let p5IsConnected = p5.connections.size == connectionAmount;
    let p6IsConnected = p6.connections.size == connectionAmount;
    let p7IsConnected = p7.connections.size == connectionAmount;
    // Concat booleans 
    let result = p1IsConnected && p2IsConnected && p3IsConnected;
    functionalityWorks("Connecting to other publock works.", result);
}
connecting_to_other_publock_works();
function disconnecting_other_publocks_works() {
    let p1 = new Publock_1.Publock();
    let p2 = new Publock_1.Publock();
    let p3 = new Publock_1.Publock();
    let p4 = new Publock_1.Publock();
    let p5 = new Publock_1.Publock();
    let p6 = new Publock_1.Publock();
    let p7 = new Publock_1.Publock();
    let connectionAmount = 6;
    p1.joinPublockNetworkFrom(p2);
    p3.joinPublockNetworkFrom(p1);
    p4.joinPublockNetworkFrom(p3);
    p5.joinPublockNetworkFrom(p2);
    p6.joinPublockNetworkFrom(p5);
    p7.joinPublockNetworkFrom(p1);
    let p1IsConnected = p1.connections.size == connectionAmount;
    let p2IsConnected = p2.connections.size == connectionAmount;
    let p3IsConnected = p3.connections.size == connectionAmount;
    let p4IsConnected = p4.connections.size == connectionAmount;
    let p5IsConnected = p5.connections.size == connectionAmount;
    let p6IsConnected = p6.connections.size == connectionAmount;
    let p7IsConnected = p7.connections.size == connectionAmount;
    let result = p1IsConnected && p2IsConnected && p3IsConnected && p4IsConnected && p5IsConnected && p6IsConnected && p7IsConnected;
    p1.disconnect();
    p6.disconnect();
    let p1IsDisconnected = p1.connections.size == 0;
    p2IsConnected = p2.connections.size == connectionAmount - 2;
    p3IsConnected = p3.connections.size == connectionAmount - 2;
    p4IsConnected = p4.connections.size == connectionAmount - 2;
    p5IsConnected = p5.connections.size == connectionAmount - 2;
    let p6IsDisconnected = p6.connections.size == 0;
    p7IsConnected = p7.connections.size == connectionAmount - 2;
    console.log(p1.id + ":" + p1.connections.size);
    console.log(p2.id + ":" + p2.connections.size);
    console.log(p3.id + ":" + p3.connections.size);
    console.log(p4.id + ":" + p4.connections.size);
    console.log(p5.id + ":" + p5.connections.size);
    console.log(p6.id + ":" + p6.connections.size);
    console.log(p7.id + ":" + p7.connections.size);
    // Concat booleans 
    result = result && p1IsDisconnected && p2IsConnected && p3IsConnected && p4IsConnected && p5IsConnected && p6IsDisconnected && p7IsConnected;
    result = result && !p2.isConnectedToPublock(p1.id);
    result = result && !p3.isConnectedToPublock(p1.id);
    result = result && !p4.isConnectedToPublock(p1.id);
    result = result && !p5.isConnectedToPublock(p1.id);
    result = result && !p7.isConnectedToPublock(p1.id);
    result = result && !p2.isConnectedToPublock(p6.id);
    result = result && !p3.isConnectedToPublock(p6.id);
    result = result && !p4.isConnectedToPublock(p6.id);
    result = result && !p5.isConnectedToPublock(p6.id);
    result = result && !p7.isConnectedToPublock(p6.id);
    functionalityWorks("Disconnecting from other publock works.", result);
}
disconnecting_other_publocks_works();
