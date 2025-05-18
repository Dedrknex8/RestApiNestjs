import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDto{

@IsNotEmpty()
@IsEmail({},{message : "email field cannot be empty"})
email

@IsString({message : "username must be a string"})
username

@IsNotEmpty({message : "password field cannot be empty"})

password

}