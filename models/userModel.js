import mongoose from "mongoose";
import bcrypt from "bcrypt";



const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please add a name"] // This is to add validation to your backend
    },
    email:{
        type: String,
        required: [true, "Please add an email"],
        unique: true,
        trim: true, // This is to remove any space around the email
        match: [ 
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
             "Please enter a valid email"
            ]
        
    },

    password:{
        type: String,
        required: [true, "Please add a Password"],
        minLength: [8, "Password must be up to 8 characters"]
    },

    photo:{
        type: String,
        required:[true, "Please input an image"],
        default: "https://i.ibb.co/4pDNDk1/avatar.png",
    },

    phone:{
        type: String,
        // default: "+234",
    },

    bio:{
        type: String,
        default: "bio",
        maxLength:[250,"Bio must not be more than 250 Characters"]
    },
  

},
{
    timestamps:true
    
})

  // Encrypt password before saving to DB
  userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(this.password,salt);
    this.password = hashPassword
    next();
    
  })

const User = mongoose.model("User", userSchema)
export default User