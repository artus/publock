import NodeRSA = require('node-rsa');
import SHA256 = require('crypto-js/sha256');
import { MessageChain } from './MessageChain';
import { Message } from './Message';

function functionalityWorks(message : string, result : boolean)
{
    console.log(result + ": " + message);
}

function initialising_a_new_MessageChain_works()
{
    let newMessageChain = new MessageChain();
    let isValid = newMessageChain.validateMessageChain();
    
    functionalityWorks("Initialising a new MessageChain", isValid);
}
initialising_a_new_MessageChain_works();

function editing_genesisMessage_will_invalidate_MessageChain()
{
    let messageChain = new MessageChain();
    messageChain.messageList[0].body = "This is the updated message";
    let isInvalid = false; 
    
    try {
        messageChain.validateMessageChain();
    } catch (e) {
        isInvalid = true;
    }
    
    functionalityWorks("Editing genesisMessage will invalidate MessageChain.", isInvalid);
}
editing_genesisMessage_will_invalidate_MessageChain();

function adding_valid_message_works()
{
    let chain = new MessageChain();
    let key = new NodeRSA({b: 512});
    
    let message = new Message("John", "This is my first message.", new Date().toISOString(), "", chain.lastMessage.hash, key.exportKey('public'));
    message.encryptedHash = message.generateEncryptedHash(key.exportKey('private'));
    message.hash = message.generateHash();
    
    let works = true;
    
    try {
        chain.addMessage(message);
    }
    catch(e) {
        works = false;
    }
    
    functionalityWorks("Adding a valid message works.", works);
}
adding_valid_message_works();

function adding_an_invalid_message_throws_error()
{
    let chain = new MessageChain();
    let key = new NodeRSA({b: 512});
    
    let message = new Message("John", "This is my first message.", new Date().toISOString(), "", "", key.exportKey('public'));
    message.encryptedHash = message.generateEncryptedHash(key.exportKey('private'));
    message.hash = message.generateHash();
    
    let throwsError = true;
    
    try {
        chain.addMessage(message);
    }
    catch(e) {
        throwsError = true;
    }
    
    functionalityWorks("Adding an invalid message throws an error works.", throwsError);
}
adding_an_invalid_message_throws_error();

function adding_multiple_messages_with_same_pseudonym_and_correct_public_key_works()
{
    let chain = new MessageChain();
    let key = new NodeRSA({b: 512});
    
    let message = new Message("John", "This is my first message.", new Date().toISOString(), "", chain.lastMessage.hash, key.exportKey('public'));
    message.encryptedHash = message.generateEncryptedHash(key.exportKey('private'));
    message.hash = message.generateHash();
    
    let works = true;
    
    try {
        chain.addMessage(message);
    }
    catch(e) {
        works = false;
    }
    
    let secondMessage = new Message("John", "This is my first message.", new Date().toISOString(), "", chain.lastMessage.hash, key.exportKey('public'));
    secondMessage.encryptedHash = secondMessage.generateEncryptedHash(key.exportKey('private'));
    secondMessage.hash = secondMessage.generateHash();
    
    try {
        chain.addMessage(secondMessage);
    }
    catch (e) {
        works = false;
    }
    
    let added = chain.messageList.length == 3;
    
    // Concat booleans
    let result = works && added;
    
    functionalityWorks("Adding multiple messages with same pseudonym and correct public key works.", result);
}
adding_multiple_messages_with_same_pseudonym_and_correct_public_key_works();

function adding_multiple_messages_with_same_pseudonym_but_incorrect_public_key_throws_error()
{
    let chain = new MessageChain();
    let key = new NodeRSA({b: 512});
    
    let message = new Message("John", "This is my first message.", new Date().toISOString(), "", chain.lastMessage.hash, key.exportKey('public'));
    message.encryptedHash = message.generateEncryptedHash(key.exportKey('private'));
    message.hash = message.generateHash();
    
    try {
        chain.addMessage(message);
    }
    catch(e) {
    }
    
    key = new NodeRSA({b: 512});
    
    let secondMessage = new Message("John", "This is my second message.", new Date().toISOString(), "", chain.lastMessage.hash, key.exportKey('public'));
    secondMessage.encryptedHash = secondMessage.generateEncryptedHash(key.exportKey('private'));
    secondMessage.hash = secondMessage.generateHash();
    
    let throwsError = false;
    
    try {
        chain.addMessage(secondMessage);
    }
    catch (e) {
        throwsError = true;
    }
    
    let notAdded = chain.messageList.length == 2;
    
    // Concat booleans
    let result = throwsError && notAdded;
    
    functionalityWorks("Adding multiple messages with same pseudonym but incorrect public key throws error.", result);
}
adding_multiple_messages_with_same_pseudonym_but_incorrect_public_key_throws_error();

function editing_message_in_MessageChain_invalidates_MessageChain()
{
    let chain = new MessageChain();
    let key = new NodeRSA({b: 512});
    
    let message = new Message("John", "This is my first message.", new Date().toISOString(), "", chain.lastMessage.hash, key.exportKey('public'));
    message.encryptedHash = message.generateEncryptedHash(key.exportKey('private'));
    message.hash = message.generateHash();
    
    try {
        chain.addMessage(message);
    }
    catch(e) {
    }
    
    let secondMessage = new Message("John", "This is my first message.", new Date().toISOString(), "", chain.lastMessage.hash, key.exportKey('public'));
    secondMessage.encryptedHash = secondMessage.generateEncryptedHash(key.exportKey('private'));
    secondMessage.hash = secondMessage.generateHash();
    
    try {
        chain.addMessage(secondMessage);
    }
    catch (e) {
    }
    
    chain.messageList[2].body = "I edited a message in the MessageChain";
    
    let throwsError = false;
    
    try {
        chain.validateMessageChain();
    }
    catch (e) {
        throwsError = true;
    }
    
    functionalityWorks("Editing message in MessageChain invalidates MessageChain.", throwsError);
}
editing_message_in_MessageChain_invalidates_MessageChain();


function copying_MessageChain_results_in_exact_copy()
{
    let mc1 = new MessageChain();
    let key = new NodeRSA({b: 512});
    
    let mc2 = MessageChain.copyMessageChain(mc1);
    
    // Check if they are the same and there fields don't get copied by reference but by value
    let firstResult = JSON.stringify(mc1) === JSON.stringify(mc2);
    mc2.messageList[0].pseudonym = "edited";
    let secondResult = JSON.stringify(mc2) !== JSON.stringify(mc1);
    
    // Add a new message 
    let message = new Message("John", "This is my first message.", new Date().toISOString(), "", mc1.lastMessage.hash, key.exportKey('public'));
    message.encryptedHash = message.generateEncryptedHash(key.exportKey('private'));
    message.hash = message.generateHash();
    
    let messageHash = message.hash;
    
    mc1.addMessage(message);
    mc2 = MessageChain.copyMessageChain(mc1);
    
    let thirdResult = JSON.stringify(mc1) === JSON.stringify(mc2);
    mc2.messageMap.get(messageHash).body = "edited";
    let fourthResult = JSON.stringify(mc1) !== JSON.stringify(mc2);
    
    // concat booleans
    let result = firstResult && secondResult && thirdResult && fourthResult;
    
    functionalityWorks("Copying MessageChain results in exact copy that is copied by value.", result);
}
copying_MessageChain_results_in_exact_copy();