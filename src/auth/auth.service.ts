import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from './entity/user.entities';
import { NoNeedToReleaseEntityManagerError, Repository } from 'typeorm';
import { RegisterDto } from './dto/register.user.dto';
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.user.dto';
import { NotFoundError } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { resourceLimits } from 'worker_threads';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { UserEventService } from 'src/events/user-event.service';
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepo : Repository<User>,
        private jwtService : JwtService,
        private ConfigService : ConfigService,
        private readonly userEventService : UserEventService
    ){}
    
    async validateOAuthLogin(oauthUser: { email: string; username: string; picture?: string }) {
  let user = await this.userRepo.findOne({ where: { email: oauthUser.email } });

  if (!user) {
    user = this.userRepo.create({
      email: oauthUser.email,
      username: oauthUser.username,
      password: '', // leave empty for OAuth users
      role: Role.User,
    });
    await this.userRepo.save(user);
    this.userEventService.emitUserRegistered(user);
  }

  const tokens = await this.generateToken(user);
  this.userEventService.emitUserLogin(user);

  return tokens;
}
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
        //EMIT THE EMITTER HERE
        this.userEventService.emitUserRegistered(createNewUser)
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

    async loginUser(loginDto : LoginDto,res:Response) : Promise<{ user: any; accessToken: string; refreshToken: string }>{

        //check if user with this data is exists or not
        const user = await this.userRepo.findOne({
            where : {email : loginDto.email},
             select: ['id', 'email', 'username', 'password', 'role'],
        });

        if(!user || !(await this.verifypassword(loginDto.password,user.password))){
            throw new UnauthorizedException("Either the email or password is not exists")
        }

        //if user exists then match password
        const tokens =  await this.generateToken(user);
        res.cookie('access_token', tokens.accessToken, {
        httpOnly: true,
        secure: false, // Set to true in production
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000, // 15 minutes
        })

        res.cookie('refresh_token', tokens.refreshToken, {
            httpOnly: true,
            secure: false, // Set to true in production
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        const {password, ...result} = user;
        
        this.userEventService.emitUserLogin(user);

        return {
            user : result,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        }
    }

    async refreshToken(refreshToken : string){
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret : 'JwtRefreshSecret'
            })

            const user = await this.userRepo.findOne({
                where : {id : payload.id}
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

    async getUserById(userId : number){
        const getUser = await this.userRepo.findOne({
            where : {id : userId }
        })

        if(!getUser){
            throw new NotFoundException('User with this id is not available')
        }

        const {password, ...result} =  getUser;

        return result;
    }

    async generateAccessToken(User:User) : Promise<string> {
        // this token will consits email,id, role

        const payload = {
            email : User.email,
            id : User.id,
            Role : User.role
        }

        return this.jwtService.sign(payload,{
            secret : this.ConfigService.getOrThrow('JWT_SECRET') ,
            expiresIn : '15m'
        })
    }
    async generateRefershToken(User:User) : Promise<string> {
        const payload = {
            id : User.id
        }

        return this.jwtService.sign(payload,{
            secret : this.ConfigService.getOrThrow('JWT_REFRESH_SECRET'),
            expiresIn : '7d'
        })
    }

    async verifypassword(plainPassword:string,hashedPassword:string): Promise<boolean>{
        
        if(!plainPassword || !hashedPassword){
            throw new BadRequestException('Password comprasion failed');
        }
        return await bcrypt.compare(plainPassword,hashedPassword);
    }
}
