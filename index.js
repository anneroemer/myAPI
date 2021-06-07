require("dotenv").config();
const express = require("express"); //express er serveren
const formidable = require("express-formidable");
const cors = require("cors");
const animals = require("./routes/animals"); //node ved at det er en js fil
const foods = require("./routes/foods");
const accessories = require("./routes/accessories");

//set up express app
const app = express();

//vi henter fra root dvs "/"

//dette kalder vi en "route"
// app.get("/", function(request, response, next){
//     response.send({"Firstname": "John", "Lastname": "Lund", "Email": "clu@rts.dk"})
// })

//import db-connection
require("./database");

app.use("/", express.static('docs'));

app.use(cors());

//parse http form data
app.use(formidable());

//set up app routes
app.use("/api/v1", animals);
app.use("/api/v1", foods);
app.use("/api/v1", accessories);

//her vælger vi en port - 4000
app.listen(process.env.PORT || 4000, function() {
    console.log("now listening for requests on port 4000");
})