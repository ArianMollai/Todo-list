process.env.NODE_ENV = 'test';
import app from '../../src/app';
import request from 'supertest';
import { User } from '../../src/models/users/usermodel';
import mongoose from 'mongoose';
import { createRefreshToken } from '../../src/utils/utils';

let accessToken: string;
let refreshToken: string;

describe('Users test', () => {
  beforeAll(async () => {
    mongoose.connect('mongodb://127.0.0.1:27017/todo-test');
    await User.deleteMany({});
  });

  it('should signup', async () => {
    const res = await request(app).post('/api/v1/users/signup').send({
      name: 'Arian',
      email: 'ar.mollaie82@gmail.com',
      password: 'Realmadrid@#$13',
    });
    expect(res.statusCode).toBe(200);
  });

  it('should create user', async () => {
    const user = await User.create({
      name: 'Mojib',
      email: 'mojib@gmail.com',
      password: 'Realmadrid@#$13',
    });
    refreshToken = createRefreshToken(user._id);
    user.refreshtoken = refreshToken;
    await user.save();
  });

  it('should login', async () => {
    const res = await request(app).post('/api/v1/users/login').send({
      name: 'Arian',
      password: 'Realmadrid@#$13',
    });
    expect(res.statusCode).toBe(200);
    accessToken = res.body.accessToken;
  });

  it('should update user', async () => {
    const res = await request(app)
      .put('/api/v1/users/update_user')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: 'arian82@gmail.com',
      });
    expect(res.statusCode).toBe(200);
  });

  it('should delete user', async () => {
    const res = await request(app)
      .delete('/api/v1/users/delete_user')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(200);
  });

  it('create new accesstoken', async () => {
    const res = await request(app)
      .get('/api/v1/users/access_token')
      .set('Cookie', [`refreshtoken=${refreshToken}`]);
    expect(res.statusCode).toBe(200);
  });

  it('should show users', async () => {
    const res = await request(app).get('/api/v1/users/showDB');
    expect(res.statusCode).toBe(200);
  });

  it('should show specific user', async () => {
    const res = await request(app).get('/api/v1/users/show_oneuser/Mojib');
    expect(res.statusCode).toBe(200);
  });
});

afterAll(async () => {
  mongoose.connection.close();
});
