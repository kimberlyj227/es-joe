const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Defining model for user collection
const userSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },

    shirtList: [
        {
            type: Schema.Types.ObjectId,
            ref: "Shirts"

        }
    ],

    id: {
        type: String,
        unique: true,
        required: true
    },
    
    shirtSize: {
        type: String,
        default: "S"
    },

    shirtColor1: {
        type: String,
        default: "Black"
    },

    shirtColor2: {
        type: String,
        default: "Black"
    },

    shirtColor3: {
        type: String,
        default: "Black"
    }


});

const Users = mongoose.model("Users", userSchema);

module.exports = Users;