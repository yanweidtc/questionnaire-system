// questionnaire-system/backend/src/swaggerOptions.ts
import swaggerJsdoc from 'swagger-jsdoc';
import { Options } from 'swagger-jsdoc';

const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Questionnaire System API',
      version: '1.0.0',
      description: 'API documentation for the Questionnaire System',
      contact: {
        name: 'Questionnaire System',
        url: 'https://github.com/questionnaire-system',
        email: 'yanweigeorg@gmail.com',
      },
    },
    servers: [
      { url: 'http://localhost:3000' },
    ],
  },
  apis: ['./src/routes/*.ts'], // 只扫描 TypeScript 文件
};

const swaggerDocument = swaggerJsdoc(swaggerOptions);

export default swaggerDocument;