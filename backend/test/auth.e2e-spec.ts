import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth Module (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  const testUser = {
    email: `test_${Date.now()}@delivra.com`,
    password: 'Test123!',
    full_name: 'Test User',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/auth/register (POST) — should register new user', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(testUser)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testUser.email);
    expect(res.body.data.token.access_token).toBeDefined();
    authToken = res.body.data.token.access_token;
  });

  it('/api/auth/register (POST) — should reject duplicate email', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(testUser)
      .expect(409);
  });

  it('/api/auth/login (POST) — should login with correct credentials', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(201);

    expect(res.body.data.token.access_token).toBeDefined();
  });

  it('/api/auth/login (POST) — should reject wrong password', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'WrongPassword' })
      .expect(401);
  });

  it('/api/auth/me (GET) — should return user profile with valid token', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(res.body.data.email).toBe(testUser.email);
  });

  it('/api/auth/me (GET) — should reject without token', async () => {
    await request(app.getHttpServer())
      .get('/api/auth/me')
      .expect(401);
  });
});

describe('Categories Module (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/categories (GET) — should return category tree', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/categories')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('Orders Module (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/orders (GET) — should require authentication', async () => {
    await request(app.getHttpServer())
      .get('/api/orders')
      .expect(401);
  });

  it('/api/search (GET) — should return search results', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/search?q=pizza')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.vendors).toBeDefined();
    expect(res.body.data.items).toBeDefined();
  });
});
