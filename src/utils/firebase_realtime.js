const admin = require('firebase-admin');
const firebaseConfig = require('./triviatrek-953b9c9779.json');

admin.initializeApp({
    databaseURL: 'https://triviatrek-187ec-default-rtdb.firebaseio.com/',
    credential: admin.credential.cert(firebaseConfig),
});

const db_realtime = admin.database();

module.exports = {
    db_realtime,
};
