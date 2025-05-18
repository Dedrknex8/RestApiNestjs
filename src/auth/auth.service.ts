import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from './entity/user.entities';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.user.dto';
import * as bcrypt from 'bcrypt'
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepo : Repository<User>
    ){}

    async registerUser(RegisterDto : RegisterDto){
        const existUser = await this.userRepo.findOne({
            where : {email : RegisterDto.email}
        })

        if(existUser){
            throw new ConflictException('Email already exists Try with different email id ')

        }

        //Now hash given Password

        const hashedPassword = await bcrypt.hash(RegisterDto.password,10);

        const createNewUser = await this.userRepo.create({
            email : RegisterDto.email,
            username : RegisterDto.username,
            password : hashedPassword,
            role : Role.User
        })

        const savedUser = await this.userRepo.save(createNewUser);

        const {password, ...result} = savedUser;

        return {
            user : result,
            message : "Registration is successfull"
        }
    }
}
