const {MongoClient,ObjectID} = require("mongodb");
const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";
// CRUD TO INSERT A DOCUMENT INTO A COLLECTION WE USE INSERT OR INSERT MANY 

MongoClient.connect(connectionURL,{useNewUrlParser:true},(error,client) =>{
    if(error) return console.log("Unable to connect to database");

    const db = client.db(databaseName);
    
    
    db.collection("users").findOne({name:"Andrew"} ,(error,user) =>{
        if(error) return console.log("Unable to find the user")
        console.log(user);
    });

    db.collection("users").find({age:19}).toArray((err,users)=>{
        if(err) return console.log("Unable to find the users");
        console.log(users);
    });

     db.collection("tasks").find({completed:false}).toArray((error,users) =>{
        console.log(users)
    })

     db.collection("users").updateOne({
        _id:new ObjectID("5ccca37deb9c6c30a4aabf11")
    },{
        $set:{
            name:"Lucas"
        }
    }).then((result) =>{
        console.log(result)
    }).catch((err)=>{
        console.log("Error :",err)
    })
 
 
    db.collection("tasks").updateMany({
        completed:false
    },{
        $set:{
            completed:true
        }
    }).then(()=>{
        console.log("Success upload")
    }) 

    db.collection("tasks").deleteOne({
        description:"Studying"
    })

});