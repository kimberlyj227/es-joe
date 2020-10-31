const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Defining model for user collection
const userSchema = new Schema({
   
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
      },
      email: {
        type: String,
        trim: true,
        required: true,
        unique: true
      },
      hashed_password: {
        type: String,
        required: true,
      },
      about: {
        type: String,
        trim: true,
      },
      salt: String,
      role: {
        type: Number,
        default: 0
      },
      history: {
        type: Array,
        default: []
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
    
    }, 
    {timestamps: true}
    );

//virtual
userSchema.virtual("password")
.set(function(password) {
  this._password = password;
  this.salt = uuidv1();
  this.hashed_password = this.encryptPassword(password);
})
.get(function() {
  return this._password
})

userSchema.methods = {
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function(password) {
    if(!password) return;
    try {
      return crypto.createHmac("sha1", this.salt)
                .update(password)
                .digest("hex")
    } catch (err) {
      return
    }
  }
};
    

   

const Users = mongoose.model("Users", userSchema);

module.exports = Users;