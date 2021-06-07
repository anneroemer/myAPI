// vi opretter kolonner og bestemmer hvilke datatyper der skal være i de kolonner. Schema får vi fra mongoose
const { Schema, model, SchemaTypes } = require("mongoose");

const AccessoriesSchema = new Schema({
    brand: SchemaTypes.String,
    product_name: SchemaTypes.String,
    price: SchemaTypes.Decimal128,
    animal: SchemaTypes.String,
    colors: SchemaTypes.Array
})

const Accessory = model("Accessory", AccessoriesSchema);

module.exports = Accessory;