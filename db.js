const {MongoClient} = require('mongodb')

const url = "mongodb+srv://rahul:PAVANk651@cluster0.rsqjuur.mongodb.net/";
let dbConncetion;
module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect(url).then( (client) => {
           dbConncetion = client.db('cafe');
           return cb();
        })
        .catch(err => {
            console.log("connection error :",err);
            return cb(err);
    
    });
    },
    getDb:() => dbConncetion
}