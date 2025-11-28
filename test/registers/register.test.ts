process.env.NODE_ENV = 'test';
import request from 'supertest';
import mongoose from 'mongoose';
import { User } from '../../src/models/users/usermodel';
import { Course } from '../../src/models/courses/coursemodel';
import { Register } from '../../src/models/registrations/registermodel';
import { hash } from 'bcryptjs';
import app from '../../src/app';

let accessToken: string;

describe('Register test', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/todo-test');

    await User.deleteMany({});
    await Register.deleteMany({});
    await Course.deleteMany({});

    await User.create({
      name: 'Arian',
      email: 'ar.mollaie82@gmail.com',
      password: await hash('Realmadrid@#$13', 10),
    });

    await Course.create({
      name: 'python',
      duration: '10H',
      time: '9:00-12:00',
      status: 'completed',
    });

    const user = await User.create({
      name: 'Mojib',
      email: 'mojib@gmail.com',
      password: await hash('Mojib@#$13', 10),
    });

    const course = await Course.create({
      name: 'Flutter',
      duration: '10H',
      time: '9:00-12:00',
      status: 'completed',
    });

    await Register.create({
      student: user._id,
      course: course._id,
    });
  });

  it('should login', async () => {
    const res = await request(app).post('/api/v1/users/login').send({
      name: 'Arian',
      password: 'Realmadrid@#$13',
    });
    expect(res.statusCode).toBe(200);
    accessToken = res.body.accessToken;
  });

  it('should register course', async () => {
    const res = await request(app)
      .post('/api/v1/registers/register')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'python',
      });
    expect(res.statusCode).toBe(200);
  });

  it('should delete registration', async () => {
    const res = await request(app)
      .delete('/api/v1/registers/cancel_register/python')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
  });

  it('should show registers', async () => {
    const res = await request(app).get('/api/v1/registers/registers');

    expect(res.statusCode).toBe(200);
  });

  it('should show one register', async () => {
    const res = await request(app).post('/api/v1/registers/oneregister').send({
      username: 'Mojib',
      coursename: 'Flutter',
    });

    expect(res.statusCode).toBe(200);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
