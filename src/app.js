const express = require("express");
const mongoose = require("mongoose");

require("./db/mongoose");

const app = express();
const port = process.env.PORT;

const routerUser = require("./Routers/user");
const routerTask = require("./Routers/task");

app.use(express.json());


// Routers of Users and Tasks
    app.use(routerUser);
    app.use(routerTask);

app.listen(port,()=>{
    console.log("Server running");
});
