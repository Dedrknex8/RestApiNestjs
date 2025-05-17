import { Post } from "src/posts/entities/post.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum Role{
    User = 'user',
    Admin = 'admin'
}
@Entity()
export class User{
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

    //Now making a realation with Postr

    @OneToMany(() => Post, (post)=> post.authorname)
    posts : Post[]

    @CreateDateColumn()
    createdAt : Date;

    @UpdateDateColumn()
    updatedAt : Date;
    
}