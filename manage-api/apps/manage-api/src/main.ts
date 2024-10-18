import {
  BadRequestException,
  Logger,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';
import fs from 'fs';
import * as helmet from 'helmet';
import { AppModule } from './app/app.module';
import { environment } from '../src/app/environments/environment';
import { swaggerUi } from 'swagger-ui-express';
var bodyParser = require('body-parser');

async function bootstrap() {

  const app = await NestFactory.create<NestApplication>(
    AppModule,
    // { logger: ['error', 'warn'], httpsOptions },
    { logger: ['error', 'warn'] }
  );

// app.use(bodyParser.json({limit: '50mb'}));
// app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  app.use(helmet());
  const bodyParser = require('body-parser');
  app.use(bodyParser.json({ limit: '5000mb' }));
  // app.use(bodyParser.limit(100000000));
  // app.use(csurf());

  // app.use(
  //   rateLimit({
  //     windowMs: 15 * 60 * 1000, // 15 minutes
  //     max: 100, // limit each IP to 100 requests per windowMs
  //   }),
  // );

  // const whitelist = ['http://15.207.33.207/manage/', 'http://localhost:4201'];
  // app.enableCors({
  //   origin: function (origin, callback) {
  //     if (whitelist.indexOf(origin) !== -1) {
  //       console.log("allowed cors for:", origin)
  //       callback(null, true)
  //     } else {
  //       console.log("blocked cors for:", origin)
  //       callback(new Error('Not allowed by CORS'))
  //     }
  //   },
  //   allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  //   credentials: true,
  // });
  app.enableCors();
  const globalPrefix = 'proxy/api';
  app.setGlobalPrefix(globalPrefix);
  const port = 3001;
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
    .setTitle('INDRA BACKEND')
    .setDescription('Backend API SPECS description')
    .setVersion('1.0')
    .setContact('support', '', 'support@indraedu.com')
    .addServer('https://admin.indraedu.com/proxy/api', 'Indra Manage API')
    .build();
  const document = SwaggerModule.createDocument(app, options, {
    operationIdFactory: (
      controllerKey: string,
      methodKey: string,
    ) => methodKey
  });
  fs.writeFileSync("./backend-api-spec.json", JSON.stringify(document));
  SwaggerModule.setup('backend/api/docs', app, document);

  // app.use('/api-docs', '1');
  // await app.init();

  await app.listen(port, () => {
    Logger.log(`Listening at localhost:${port}/${globalPrefix}`);
  });

}

bootstrap();
