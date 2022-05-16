import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('User Service Test', () => {
  let app: INestApplication;
  let jwt: string

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const authenticateBody = {
        username: "user2@foreside.nl",
        password:"Password123!"
      };
    const response = await request(app.getHttpServer())
      .post('/authenticate')
      .send(authenticateBody)
      .expect(200)
    jwt = response.body.access_token
  });

  afterEach(async () => {
    await app.close();
  })

  it('/password', async () => {
    const passChangeBody = {
        newPassword: "Password123!!",
        confirmPassword:"Password123!!"
      };
    const passwordResponse = await request(app.getHttpServer())
      .post('/password/changePassword')
      .send(passChangeBody)
      .set('Authorization', `Bearer ${jwt}`)
      .expect(201)

    const passwordResponse2 = await request(app.getHttpServer())
      .post('/password/changePassword')
      .send(passChangeBody)
      .set('Authorization', `Bearer ${jwt}`)
      .expect(201)

  })

});