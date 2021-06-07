const express = require("express");
const router = express.Router();
const Food = require("../models/foods.model");
const auth = require("../auth-middleware");


//get all animals
router.get("/foods", auth, async function(request, response, next) {

    try {
        let result = await Food.find(); //når vi laver en async function kan vi bruge "await" 

        response.json(result);
        
    } catch (error) {
        return next(error)
    }

})

//get single animal by ID
router.get("/foods/:foodId", auth, async function(request, response, next){
    try {
        let result = await Food.findById(request.params.foodId);
        //let result = await Food.findOne({})

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

router.post("/foods", auth, function(request, response, next) {

    //vi har adgang til fields keywordet fordi vi bruger formidable
    try {
        let food = new Food({
            brand: request.fields.brand, 
            product_name: request.fields.product_name,
            price: request.fields.price,
            weight: request.fields.weight,
            animal: request.fields.animal
        })
        food.save(); //save er vist nok en mongoose metode

        response.status(201); //status 201 betyder "created". Der var succes og der er blevet kreeret en resource. 
        response.json(food);

    } catch (error){
        return next(error)
    }

})

router.patch("/foods/:foodId", auth, async function(request, response, next) {

    let { brand, product_name, price, weight, animal } = request.fields;
    let updateObject = {};
    
    if (brand) updateObject.brand = brand;
    if (product_name) updateObject.product_name = product_name;
    if (price) updateObject.price = price;
    if (weight) updateObject.weight = weight;
    if (animal) updateObject.animal = animal;

    let food = await Food.findByIdAndUpdate(request.params.foodId, updateObject, {new: true});
    
    response.json(food)

})

router.delete("/foods/:foodId", auth, async function(request, response, next) {
    
    try {
        await Food.findByIdAndDelete(request.params.foodId);
        response.status(200)
        response.end(); 
    } catch (error) {
        return next (error)
    }

    response.send("delete request foods")

})

module.exports = router;