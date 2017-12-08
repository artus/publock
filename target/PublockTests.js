"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Publock_1 = require("./Publock");
function functionalityWorks(message, result) {
    console.log(result + ": " + message);
}
function creating_a_new_publock_works() {
    let newPublock = new Publock_1.Publock();
    let messgeChain = typeof newPublock.messageChain != 'undefined';
    let connections = typeof newPublock.connections != 'undefined';
    let offeringConnection = typeof newPublock.offeringConnection != 'undefined';
    let answeringConnection = typeof newPublock.answerConnection != 'undefined';
    let result = messgeChain && connections && offeringConnection && answeringConnection;
    functionalityWorks("creating a new publock works.", result);
}
creating_a_new_publock_works();
function connecting_to_other_publock_works() {
    let p1 = new Publock_1.Publock(true);
    let p2 = new Publock_1.Publock(true);
    let p3 = new Publock_1.Publock(true);
    let p4 = new Publock_1.Publock(true);
    let p5 = new Publock_1.Publock(true);
    let p6 = new Publock_1.Publock(true);
    let p7 = new Publock_1.Publock(true);
    p1.connectToPeer(p2.answeringConnection);
    p2.connectToPeer(p3.answeringConnection);
    p3.connectToPeer(p4.answeringConnection);
    p4.connectToPeer(p5.answeringConnection);
    p5.connectToPeer(p6.answeringConnection);
    p6.connectToPeer(p7.answeringConnection);
    console.log(p1.connections.size);
    console.log(p2.connections.size);
    console.log(p3.connections.size);
    console.log(p4.connections.size);
    console.log(p5.connections.size);
    console.log(p6.connections.size);
    console.log(p7.connections.size);
    let result = p1.connections.size == 2 && p2.connections.size == 2; //&& p3.connections.size == 2;
    functionalityWorks("Connecting to other publocks works.", result);
}
connecting_to_other_publock_works();
function disconnecting_other_publocks_works() {
    let p1 = new Publock_1.Publock();
    let p2 = new Publock_1.Publock();
    let id = p1.offeringConnection.id;
    p1.connectToPeer(p2.answeringConnection);
    p1.disconnectPeer(id);
    let result = p1.connections.size == 0 && p2.connections.size == 0;
    functionalityWorks("Disconnecting other publocks works.", result);
}
disconnecting_other_publocks_works();
