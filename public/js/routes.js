const { api } = require("../../models/api");

const socket = io();




function joinChat(uid) {

    api.readUser(uid).then(user => {
        console.log("Opening chat of " +  uid);  
    });

    console.log('joinChat');

}






