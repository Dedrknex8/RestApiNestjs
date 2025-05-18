import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";


export class LoginDto{
    @IsNotEmpty()
    @IsEmail({},{message : "Email is required"})
    email : string

    @IsNotEmpty({message : "Password cannot be empty"})
    @IsString({message: 'Password must be a string'})
    @MinLength(7,{message : "password cannot have more 8 characters long"})
    
    password:string


}