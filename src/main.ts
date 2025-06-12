import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser'
import { LoggingInterceptor } from './interceptor/login.interceptor';
async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger : ['error','warn','debug','log']
  });

  app.use(cookieParser());
  //this will automatically validate incoming req but can be used in controller using @Usepipe()
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist : true,
      forbidNonWhitelisted:true,
      transform:true, //automatically transformed payload into object type a/q to dto
      disableErrorMessages:false
    })
  );

  app.useGlobalInterceptors(new LoggingInterceptor());

  app.enableCors({
    origin : true,
    credentials : true,
  });

  


  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
