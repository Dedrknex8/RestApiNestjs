import { IsOptional, IsString, MaxLength, maxLength } from "class-validator";


export class uploadFileDto{
    @IsOptional()
    @IsString()
    @MaxLength(50)
    description ?: string
}