import { User } from "src/auth/entity/user.entities";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id : number;

    @Column({length : 50})
    title : string;

    @Column({length : 50})
    content : string;

    @ManyToOne(()=>User , (user)=> user.posts)
    authorname : User; //realtion to connect with user 

    @CreateDateColumn()
    createdAt : Date;

    @UpdateDateColumn()
    updatedAt : Date;


}