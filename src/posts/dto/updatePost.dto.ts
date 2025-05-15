import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";


export class UpdatePostDto{
    @IsOptional()
    @IsString({message : "Title must be a string"})
    @MinLength(3,{message : "Title length shouldn't less than 4 characters"})
    title ?: string
    
    @IsOptional()
    @IsString({message : "Title must be a string"})
    @MinLength(3,{message : "Content length shouldn't less than 4 characters"})
    content ?: string
    
    @IsOptional()
    @IsString({message : "Title must be a string"})
    @MinLength(3,{message : "authorname length shouldn't less than 4 characters"})
    authorname ?: string


}