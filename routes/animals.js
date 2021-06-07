const express = require("express");
const router = express.Router();
const Animal = require("../models/animals.model");
const auth = require("../auth-middleware");


//middeware eksempel
// router.get("/",
//     function(req, res, next){

//     }, 
//     function(req, res, next){
        
//     })


//get all animals
/*
router.get("/animals", auth, async function(request, response, next) {
    //response.send("get request animals")
    //try catch kan vi bruge som et promise i stedet for .then
    try {
        let result = await Animal.find(); //når vi laver en async function kan vi bruge "await" 
        response.json(result);    
    } catch (error) {
        return next(error)
    }
})
*/


router.get("/animals", async function(request, response, next) {
    
    let limit = parseInt(request.query.limit) || 5;
    let offset = parseInt(request.query.offset) || 0;

    try {

        let count = (await Animal.find()).length;
        let result = await Animal.find().limit(limit).skip(offset);

        let queryStringNext = `?offset=${offset+limit}&limit=${limit}`;
        let queryStringPrevious;

        if (offset >= limit) {
            queryStringPrevious = `?offset=${offset - limit}&limit=${limit}`;
        }

        //kig her: https://expressjs.com/en/4x/api.html#req.hostname
        //insomnia - get all animals. Giver svar localhost:4000 osv i terminalen
        let apiUrl = `${request.protocol}://${request.hostname}${request.hostname==="localhost" ? ":" + process.env.PORT : ""}`;

        let apiPath = `${request.baseUrl}${request.path}`;

        let output = {
            count, //count: count - vi kan undlade count 
            next: (offset + limit < count) ? apiUrl + apiPath + queryStringNext : null,
            previous: offset > 0 ? apiUrl + apiPath + queryStringPrevious : null,
            result, //samme her
            url: apiUrl + request.originalUrl
        }

        console.log(apiUrl);
        
        response.json(output);
        
    } catch (error) {
        return next(error)
    }

})

//get single animal by ID
router.get("/animals/:animalId", async function(request, response, next){
    try {
        let result = await Animal.findById(request.params.animalId);
        //let result = await Animal.findOne({})

        if (result == null) { //return 404 if no result is found
            //response.status(404) //404 not found
            //response.end();
            return next(new Error("Cannot find requested resource"))
        }

        response.status(200) //denne er til dels unødvendig, da status 200 er default status i express
        response.json(result)

    } catch (error) {
        return next (error)
    }
});

router.post("/animals", function(request, response, next) {

    //response.send("post request animals")

    //vi har adgang til fields keywordet fordi vi bruger formidable
    try {
        let animal = new Animal({
            type: request.fields.type, 
            breed: request.fields.breed,
            name: request.fields.name,
            age: request.fields.age,
            sex: request.fields.sex,
            colors: request.fields.colors
        })
        animal.save(); //save er vist nok en mongoose metode

        response.status(201); //status 201 betyder "created". Der var succes og der er blevet kreeret en resource. 
        response.json(animal);

    } catch (error){
        return next(error)
    }

})

router.patch("/animals/:animalId", auth, async function(request, response, next) {

    let { type, breed, name, age, sex, colors } = request.fields;
    let updateObject = {};
    
    if (type) updateObject.type = type;
    if (breed) updateObject.breed = breed;
    if (name) updateObject.name = name;
    if (age) updateObject.age = age;
    if (sex) updateObject.sex = sex;
    if (colors) updateObject.colors = colors;

    let animal = await Animal.findByIdAndUpdate(request.params.animalId, updateObject, {new: true});
    
    response.json(animal)

})

router.delete("/animals/:animalId", auth, async function(request, response, next) {
    
    try {
        await Animal.findByIdAndDelete(request.params.animalId);
        response.status(200)
        response.end(); 
    } catch (error) {
        return next (error)
    }

    response.send("delete request animals")

})

module.exports = router;