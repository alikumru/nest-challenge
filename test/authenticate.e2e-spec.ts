import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authenticate Service Test', () => {
  let app: INestApplication;


  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

  });

  afterEach(async () => {
    await app.close();
  })

  it('/authenticate , to authenticate user with credentials', async () => {
    const authenticateBody = {
      username: "user1@foreside.nl",
      password:"Password123!"
    };
    const response = await request(app.getHttpServer())
      .post('/authenticate')
      .send(authenticateBody)
      .expect(200)

      let jwtToken = response.body.access_token
      expect(jwtToken).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
  })

  it('fails to authenticate user with an incorrect password', async () => {
    const response = await request(app.getHttpServer())
      .post('/authenticate')
      .send({ email: 'test@example.com', password: 'wrong' })

    expect(response.body.access_token).not.toBeDefined()
  })

});