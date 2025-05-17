import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum Role{
    User = 'user',
    Admin = 'admin'
}
@Entity()
export class Auth{
    @PrimaryGeneratedColumn()
    id : number

    @Column({length : 7,unique:true})
    email : string

    @Column({length : 5})
    username : string

    @Column()
    password : string //hashed passwd

    @Column({
        type : 'enum',
        enum : Role,
        default : Role.User
    })

    role : string
    
}