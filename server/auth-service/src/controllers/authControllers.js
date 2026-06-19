import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createUser,findUserByEmail } from "../models/userModel";

export const registerUser = (req,res)=>{

try {
        const {name , email,password} = req.body;

    if(!name || !email || password) {
        return;
    }
    //checking user exit or not 

    const existingUser = await findUserByEmail(email);
    if(existingUser){
        return;
    }
    const hashpassword = bcrypt.hash(password,10);
    const newUser = createUser(name, email,hashpassword);
    
} catch (error) {
    
}






}