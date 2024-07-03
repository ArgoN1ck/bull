import { ValidationException } from '@bull/core/exceptions';
import { Logger as NestLogger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app/app.module';
import { corsConfig } from './configs/cors';
import { buildDoc } from './configs/swagger';
import { environment } from './environment/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const logger = app.get(Logger);
  app.useLogger(logger);
  app.flushLogs();

  app.enableShutdownHooks();

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app
    .use(cookieParser())
    .useGlobalPipes(
      new ValidationPipe({
        transform: true,
        exceptionFactory(errors) {
          throw new ValidationException(
            errors.map(({ property, constraints }) => ({
              code: property,
              description: constraints,
            }))
          );
        },
      })
    )
    .enableCors(corsConfig);

  const port = environment.app.port;
  const hostname = environment.app.host;

  if (!environment.production) {
    buildDoc(app, globalPrefix);
  }

  await app.listen(port, hostname, () => {
    logger.log(
      `🚀 Application is running on: http://${hostname}:${port}/${globalPrefix}`
    );
  });
}

process.on('exit', exitHandler.bind(null, { cleanup: true }));

process.on('SIGINT', exitHandler.bind(null, { exit: true }));

process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

process.on('uncaughtException', exitHandler.bind(null, { exit: true }));

const logger = new NestLogger('NestApplication');
try {
  bootstrap().catch((err) => {
    logger.error(err, err.stack);
  });
} catch (err) {
  logger.error(err, err.stack);
}

function exitHandler(options, exitCode) {
  if (options.cleanup) {
    logger.log('exit: clean');
  }
  if (exitCode || exitCode === 0) {
    if (exitCode !== 0) {
      logger.error(exitCode, exitCode.stack);
    } else {
      logger.log(`exit: code - ${exitCode}`);
    }
  }
  if (options.exit) {
    process.exit();
  }
}
