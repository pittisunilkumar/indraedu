import {
  BadRequestException,
  Logger,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as rateLimit from 'express-rate-limit';
import fs from 'fs';
import * as helmet from 'helmet';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import * as compression from 'compression';

async function bootstrap() {

  const app = await NestFactory.create<NestApplication>(
    AppModule,
    // { logger: ['error', 'warn'], httpsOptions },
    { logger: ['error', 'warn'] },
  );

  // app.use(
  //   rateLimit({
  //     windowMs: 15 * 60 * 1000, // 15 minutes
  //     max: 100, // limit each IP to 100 requests per windowMs
  //   }),
  // );

  app.use(compression({ level:6, threshold:100* 1000, filter: shouldCompress }))
 
  function shouldCompress (req, res) {
    if (req.headers['x-no-compression']) {
      // don't compress responses with this request header
      return false
    }
    return compression.filter(req, res)
  }
  
  app.use(helmet());
  app.enableCors();
  const globalPrefix = 'proxy/api';
  app.setGlobalPrefix(globalPrefix);
  const port = 3002;
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,
      whitelist: false,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(validationErrors);
      },
    })
  );

  // API DOCS -SWAGGER
  const options = new DocumentBuilder()
    .setTitle('PLATO STUDENTS')
    .setDescription('The Users API description')
    .setVersion('1.0')
    .setContact('Architect', '', 'venkata.krishna@platoonline.com')
    .addServer('https://students-api-spec.platoonline.co', 'Plato Students API')
    .build();
  const document = SwaggerModule.createDocument(app, options, {
    operationIdFactory: (
      controllerKey: string,
      methodKey: string,
    ) => methodKey
  });
  fs.writeFileSync("./students-api-spec.json", JSON.stringify(document));
  SwaggerModule.setup('students/api/docs', app, document);

  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });

}

bootstrap();
