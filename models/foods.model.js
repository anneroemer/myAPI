// vi opretter kolonner og bestemmer hvilke datatyper der skal være i de kolonner. Schema får vi fra mongoose
const { Schema, model, SchemaTypes } = require("mongoose");

const FoodsSchema = new Schema({
    brand: SchemaTypes.String,
    product_name: SchemaTypes.String,
    price: SchemaTypes.Decimal128,
    weight: SchemaTypes.Number,
    animal: SchemaTypes.String
})

const Food = model("Food", FoodsSchema);

module.exports = Food;