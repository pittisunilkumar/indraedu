var firebase = require("firebase-admin");

var serviceAccount = require("../config/plato-online-firebase.json");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
});

module.exports.firebase = firebase
