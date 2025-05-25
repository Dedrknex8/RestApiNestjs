import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser'
import * as csurf from 'csurf'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //this will automatically validate incoming req but can be used in controller using @Usepipe()
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist : true,
      forbidNonWhitelisted:true,
      transform:true, //automatically transformed payload into object type a/q to dto
      disableErrorMessages:false
    })
  );

  app.use(cookieParser());


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
