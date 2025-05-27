import { IsOptional, IsString, MaxLength } from "class-validator";
import { paginationQueryDTO } from "./pagination.dto";


export class FindPageQueryDTO extends paginationQueryDTO{
    @IsOptional()
    @IsString({message : "Title must be a string"})
    @MaxLength(100,{message : 'Title cannot be length more than 100'})
    title ?:string    
}