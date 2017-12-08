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
    let p1 = new Publock_1.Publock(false);
    let p2 = new Publock_1.Publock(false);
    p1.connectToPeer(p2.answeringConnection);
    p2.answerConnection(p1.offeringConnection);
    let result = p1.connections.size != 0 && p2.connections.size != 0;
    functionalityWorks("Connecting to other publocks works.", result);
}
connecting_to_other_publock_works();
