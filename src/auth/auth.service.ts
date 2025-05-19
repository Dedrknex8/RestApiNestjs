import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from './entity/user.entities';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.user.dto';
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.user.dto';
import { NotFoundError } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepo : Repository<User>,
        private jwtService : JwtService
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


    async createAdminUser(RegisterDto : RegisterDto){
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
            role : Role.Admin
        })

        const savedUser = await this.userRepo.save(createNewUser);

        const {password, ...result} = savedUser;

        return {
            user : result,
            message : "Registration is successfull"
        }
    }

    async loginUser(loginDto : LoginDto){

        //check if user with this data is exists or not
        const user = await this.userRepo.findOne({
            where : {email : loginDto.email}
        });

        if(!user || !(await this.verifypassword(loginDto.password,user.password))){
            throw new UnauthorizedException("Either the email or password is not exists")
        }

        //if user exists then match password
        const tokens =  await this.generateToken(user);

        const {password, ...result} = user;

        return {
            user : result,
            ...tokens
        }
    }

    async refreshToken(refreshToken : string){
        try {
            const paylaod = this.jwtService.verify(refreshToken, {
                secret : 'JwtRefreshSecret'
            })

            const user = await this.userRepo.findOne({
                where : {id : paylaod.id}
            })

            if(!user){
                throw new UnauthorizedException('Invalid token')
            }

            const accessToken = await this.generateAccessToken(user)

            return {accessToken};
            
        } catch (error) {
            console.error(error)
            throw new UnauthorizedException('Invalid Token is not valid')
        }
    }
    async generateToken(User : User): Promise<{accessToken:string,refreshToken:string}>{

        const accessToken = await this.generateAccessToken(User);
        const refreshToken = await this.generateRefershToken(User);

        return {
            accessToken,
            refreshToken
        }
    }

    async generateAccessToken(User:User) : Promise<string> {
        // this token will consits email,id, role

        const payload = {
            email : User.email,
            id : User.id,
            Role : User.role
        }

        return this.jwtService.sign(payload,{
            secret : 'JwtSecret',
            expiresIn : '15m'
        })
    }
    async generateRefershToken(User:User) : Promise<string> {
        const payload = {
            id : User.id
        }

        return this.jwtService.sign(payload,{
            secret : 'JwtRefreshSecret',
            expiresIn : '7d'
        })
    }

    async verifypassword(plainPassword:string,hashedPassword:string): Promise<boolean>{
        return await bcrypt.compare(plainPassword,hashedPassword);
    }
}
