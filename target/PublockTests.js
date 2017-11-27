"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageChain_1 = require("./MessageChain");
function functionalityWorks(message, result) {
    console.log(result + ": " + message);
}
function initialising_a_new_MessageChain_works() {
    let newMessageChain = new MessageChain_1.MessageChain();
    console.log(newMessageChain.messageList[0]);
    let isValid = newMessageChain.validateMessageChain();
    functionalityWorks("Initialising a new MessageChain", isValid);
}
initialising_a_new_MessageChain_works();
