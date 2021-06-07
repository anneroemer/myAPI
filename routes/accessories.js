const express = require("express");
const router = express.Router();
const Accessory = require("../models/accessories.model");
const auth = require("../auth-middleware");



//get all animals
router.get("/accessories", auth, async function(request, response, next) {

    try {
        let result = await Accessory.find(); //når vi laver en async function kan vi bruge "await" 

        response.json(result);
        
    } catch (error) {
        return next(error)
    }

})

//get single animal by ID
router.get("/accessories/:accessoryId", auth, async function(request, response, next){
    try {
        let result = await Accessory.findById(request.params.accessoryId);
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

router.post("/accessories", auth, function(request, response, next) {

    //vi har adgang til fields keywordet fordi vi bruger formidable
    try {
        let accessory = new Accessory({
            brand: request.fields.brand, 
            product_name: request.fields.product_name,
            price: request.fields.price,
            animal: request.fields.animal,
            colors: request.fields.colors
        })
        accessory.save(); //save er vist nok en mongoose metode

        response.status(201); //status 201 betyder "created". Der var succes og der er blevet kreeret en resource. 
        response.json(accessory);

    } catch (error){
        return next(error)
    }

})

router.patch("/accessories/:accessoryId", auth, async function(request, response, next) {

    let { brand, product_name, price, animal, colors } = request.fields;
    let updateObject = {};
    
    if (brand) updateObject.brand = brand;
    if (product_name) updateObject.product_name = product_name;
    if (price) updateObject.price = price;
    if (animal) updateObject.animal = animal;
    if (colors) updateObject.colors = colors;

    let accessory = await Accessory.findByIdAndUpdate(request.params.accessoryId, updateObject, {new: true});
    
    response.json(accessory)

})

router.delete("/accessories/:accessoryId", auth, async function(request, response, next) {
    
    try {
        await Accessory.findByIdAndDelete(request.params.accessoryId);
        response.status(200)
        response.end(); 
    } catch (error) {
        return next (error)
    }

    response.send("delete request accessory")

})

module.exports = router;