import { NotImplementedException } from "@nestjs/common";

export interface PaginationMetaFormat{
    currentPage : number,
    itemsPerpage : number,
    totalItems : number,
    totalPages : number,
    hashPrevPage  : boolean,
    hashNextPage  : boolean
}

export interface PaginationReponse<T>{
    items : T[],
    meta : PaginationMetaFormat
}