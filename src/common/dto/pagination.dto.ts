import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";


export class paginationQueryDTO{

    @IsOptional()
    @Type(()=> Number)
    @IsInt({message : 'page must be a integer'})
    @Min(1,{message : 'Page must be at atleast one'})
    page?: number = 1
    
    @IsOptional()
    @Type(()=> Number)
    @IsInt({message : 'limit must be a integer'})
    @Min(1,{message : 'limit must be at atleast one'})
    @Max(100,{message : 'limit cannot be more than 100'})
    limit?: number = 1
}