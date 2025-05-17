import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDto{

@IsNotEmpty()
@IsEmail({},{message : "email field cannot be empty"})
email

@IsString({message : "username must be a string"})
username

@IsNotEmpty({message : "password field cannot be empty"})
@MinLength(7,{message : "password cannot have more 8 characters long"})
password

}