process.env.NODE_ENV = 'test';
import request from 'supertest';
import app from '../../src/app';
import mongoose from 'mongoose';
import { User } from '../../src/models/users/usermodel';
import { Course } from '../../src/models/courses/coursemodel';
import { hash } from 'bcryptjs';

let token: string;

describe('course api test', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/todo-test');
    await User.deleteMany({});
    await Course.deleteMany({});

    await User.create({
      name: 'Arian',
      email: 'ar.mollaie82@gmail.com',
      password: await hash('Realmadrid@#$13', 10),
    });

    const res = await request(app).post('/api/v1/users/login').send({
      name: 'Arian',
      password: 'Realmadrid@#$13',
    });
    expect(res.statusCode).toBe(200);
    token = res.body.accessToken;
  });

  it('should create new course', async () => {
    const res = await request(app)
      .post('/api/v1/courses/create_course')
      .query({
        duration: '10H',
        time: '9:00-12:00',
        status: 'completed',
      })
      .send({
        name: 'python',
      })
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it('should create new course', async () => {
    const res = await request(app)
      .post('/api/v1/courses/create_course')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'flutter' })
      .query({
        duration: '10H',
        time: '9:00-12:00',
        status: 'completed',
      });
    expect(res.statusCode).toBe(200);
  });

  it('should update course', async () => {
    const res = await request(app)
      .put('/api/v1/courses/update_course/python')
      .set('Authorization', `Bearer ${token}`)
      .query({
        name: 'js',
        duration: '150H',
        time: '12:00-15:00',
        status: 'not started',
      });
    console.log(res.body);
    expect(res.status).toBe(200);
  });

  it('should delete course', async () => {
    const res = await request(app)
      .delete('/api/v1/courses/delete_course/js')
      .set('Authorization', `Bearer ${token}`);
    console.log(res.body);
    expect(res.status).toBe(200);
  });

  it('should show all courses', async () => {
    const res = await request(app).get('/api/v1/courses/show_courses');
    expect(res.statusCode).toBe(200);
  });

  it('should show specific course', async () => {
    const res = await request(app).get(
      '/api/v1/courses/show_onecourse/flutter',
    );
    expect(res.statusCode).toBe(200);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
