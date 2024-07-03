import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readFileSync, writeFile } from 'fs';
import { join } from 'path';

export const buildDoc = (app: INestApplication, docPath: string) => {
  const packageJson: { version: string; name: string; description: string } =
    JSON.parse(readFileSync('./package.json').toString());

  const config = new DocumentBuilder()
    .setTitle('Bull API')
    .setDescription(packageJson.description)
    .setVersion(packageJson.version)
    .build();
  const document = SwaggerModule.createDocument(app, config);

  writeFile(
    join(process.cwd(), 'apps/api/src', 'swagger.json'),
    JSON.stringify(document),
    (err) => err
  );

  SwaggerModule.setup(docPath, app, { ...document, openapi: '3.1.0' }, {});
};
