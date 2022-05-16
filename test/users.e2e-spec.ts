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
        username: "user1@foreside.nl",
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

  it('/users ', async () => {

      const userResponse = await request(app.getHttpServer())
      .get('/user/me')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200)

      expect(userResponse.body.email).toEqual('user1@foreside.nl')
  })

  it('/users ', async () => {

      const userResponse = await request(app.getHttpServer())
      .get('/users/463a7f16-14da-4bb4-beea-566be05ff369')
      .set('Authorization', `Bearer ${jwt}`)
      .expect(200)

      expect(userResponse.body.email).toEqual('user1@foreside.nl')
  })

});