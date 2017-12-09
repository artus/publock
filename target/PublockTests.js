"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Publock_1 = require("./Publock");
const Message_1 = require("./Message");
const NodeRSA = require("node-rsa");
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
function kicking_publock_from_network_works() {
    let p1 = new Publock_1.Publock();
    let p2 = new Publock_1.Publock();
    let p3 = new Publock_1.Publock();
    let p4 = new Publock_1.Publock();
    p2.joinPublockNetworkFrom(p1);
    p3.joinPublockNetworkFrom(p2);
    p4.joinPublockNetworkFrom(p1);
    let p1Has3Connections = p1.connections.size == 3;
    let p2Has3Connections = p2.connections.size == 3;
    let p3Has3Connections = p3.connections.size == 3;
    let p4Has3Connections = p4.connections.size == 3;
    let result = p1Has3Connections && p2Has3Connections && p3Has3Connections && p4Has3Connections;
    p4.kickPublockFromNetwork(p1);
    let p1Has0Connections = p1.connections.size == 0;
    let p2Has2Connections = p2.connections.size == 2;
    let p3Has2Connections = p3.connections.size == 2;
    let p4Has2Connections = p4.connections.size == 2;
    result = result && p1Has0Connections && p2Has2Connections && p3Has2Connections && p4Has2Connections;
    functionalityWorks("Kicking publock from networks works.", result);
}
kicking_publock_from_network_works();
function adding_message_to_networks_works() {
    let p1 = new Publock_1.Publock();
    let p2 = new Publock_1.Publock();
    let p3 = new Publock_1.Publock();
    let key = new NodeRSA({ b: 512 });
    p2.connectToPublock(p1);
    p3.connectToPublock(p2);
    p1.addNewMessage("test", "this is a test", "", key);
    let p1HasMessage = p1.messageChain.size == 2;
    let p2HasMessage = p2.messageChain.size == 2;
    let p3HasMessage = p3.messageChain.size == 2;
    let result = p1HasMessage && p2HasMessage && p3HasMessage;
    functionalityWorks("Adding message to network works.", result);
}
adding_message_to_networks_works();
function adding_incorrect_message_to_networks_does_not_work() {
    let p1 = new Publock_1.Publock();
    let p2 = new Publock_1.Publock();
    let p3 = new Publock_1.Publock();
    p2.connectToPublock(p1);
    p3.connectToPublock(p1);
    let key = new NodeRSA({ b: 512 });
    let newMessage = new Message_1.Message("test", "this is a test", new Date().toISOString(), "", p1.messageChain.lastMessage.hash, key.exportKey('public'));
    newMessage.encryptedHash = newMessage.generateEncryptedHash(key.exportKey('private'));
    newMessage.hash = newMessage.generateHash();
    newMessage.body = "this is edited.";
    p1.addMessageToNetwork(newMessage);
    let p1HasOneMessage = p1.messageChain.size == 1;
    let p2HasOneMessage = p2.messageChain.size == 1;
    let p3HasOneMessage = p3.messageChain.size == 1;
    let result = p1HasOneMessage && p2HasOneMessage && p3HasOneMessage;
    functionalityWorks("Adding incorrect message to network does not work.", result);
}
adding_incorrect_message_to_networks_does_not_work();
