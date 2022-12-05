const { describe, it, before, beforeEach, after } = require('mocha');
const request = require('supertest')('http://localhost:8888');
const should = require('should');
const { hashPassword } = require('../utils/auth.utils');
const { User } = require('../models/user');
const constants = require('../constants/auth.constants');

describe('Authentication/Authorization tests', () => {
  const loginEndpoint = '/auth/login';

  const createdUsers = [];

  before(async () => {
    require('dotenv').config();
    const setupDB = require('../models');
    await setupDB();
    // Create a user in the database
    createdUsers.push(
      await User.create({
        name: 'test',
        email: 'test@gmail.com',
        password: hashPassword('password'),
      })
    );
  });

  after(async () => {
    // Remove the user from the database
    await Promise.all(createdUsers.map((user) => user.remove()));
  });

  beforeEach((done) => {
    done();
    // setTimeout(done, 500);
  });

  describe('Authentication', () => {
    describe('Login with invalid data', () => {
      it('should return 400 if username is missing', (done) => {
        request
          .post(loginEndpoint)
          .send({ password: 'password' })
          .expect(400)
          .end((err, res) => {
            if (err) return done(err);
            res.body.should.have.property(
              'message',
              'Username and password are required'
            );
            done();
          });
      });
      it('should return 400 if password is missing', (done) => {
        request
          .post(loginEndpoint)
          .send({ username: 'test' })
          .expect(400)
          .end((err, res) => {
            if (err) return done(err);
            should(res.body).have.property(
              'message',
              'Username and password are required'
            );
            done();
          });
      });
      it('should return 401 if the credentials are wrong', (done) => {
        request
          .post(loginEndpoint)
          .send({ username: 'test', password: 'not password' })
          .expect(401)
          .end((err, res) => {
            if (err) return done(err);
            should(res.body).have.property(
              'message',
              'Wrong username or password'
            );
            done();
          });
      });
    });

    describe('Login with valid data', async () => {
      const credentials = { username: 'test', password: 'password' };
      it('should return 200 if the credentials are correct', (done) => {
        request
          .post('/auth/login')
          .send(credentials)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            should(res.body).have.property('message', 'Login successful');
            done();
          });
      });
      it('should return a JWT token HTTP-Only cookie', (done) => {
        request
          .post('/auth/login')
          .send(credentials)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            // check if there is a cookie with the name of the JWT token
            should(res.headers['set-cookie'][0]).containEql(
              constants.JWT_COOKIE_NAME
            );
            // check if the cookie JWT_TOKEN is HTTP-only
            should(res.headers['set-cookie'][0]).containEql('HttpOnly');
            done();
          });
      });
      it('should return a refresh token HTTP-Only cookie', (done) => {
        request
          .post('/auth/login')
          .send(credentials)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            // check if there is a cookie with the name of the refresh token
            should(res.headers['set-cookie'][1]).containEql(
              constants.REFRESH_COOKIE_NAME
            );
            // check if the cookie REFRESH_TOKEN is HTTP-only
            should(res.headers['set-cookie'][1]).containEql('HttpOnly');
            done();
          });
      });
    });

    describe('Logout', () => {
      it('should return 200', (done) => {
        request
          .post('/auth/logout')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            should(res.body).have.property('message', 'Logout successful');
            done();
          });
      });
      it('should remove the JWT token cookie', (done) => {
        request
          .post('/auth/logout')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            should(res.headers['set-cookie'][0]).containEql(
              `${constants.JWT_COOKIE_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly`
            );
            done();
          });
      });
      it('should remove the refresh token cookie', (done) => {
        request
          .post('/auth/logout')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            should(res.headers['set-cookie'][1]).containEql(
              `${constants.REFRESH_COOKIE_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly`
            );
            done();
          });
      });
    });

    describe('Register', () => {
      it('should return 400 if username is missing', (done) => {
        request
          .post('/auth/signup')
          .send({ password: 'password' })
          .expect(400)
          .end((err, res) => {
            if (err) return done(err);
            should(res.body).have.property(
              'message',
              'Email, username and password are required'
            );
            done();
          });
      });
      it('should return 400 if password is missing', (done) => {
        request
          .post('/auth/signup')
          .send({ username: 'test' })
          .expect(400)
          .end((err, res) => {
            if (err) return done(err);
            should(res.body).have.property(
              'message',
              'Email, username and password are required'
            );
            done();
          });
      });
      it('should return 400 if email is missing', (done) => {
        request
          .post('/auth/signup')
          .send({ username: 'test', password: 'password' })
          .expect(400)
          .end((err, res) => {
            if (err) return done(err);
            should(res.body).have.property(
              'message',
              'Email, username and password are required'
            );
            done();
          });
      });
      it('should return 400 if username is already taken', (done) => {
        request
          .post('/auth/signup')
          .send({
            username: 'test',
            password: 'password',
            email: 'test@gmail.com',
          })
          .expect(400)
          .end((err, res) => {
            if (err) return done(err);
            should(res.body).have.property(
              'message',
              'Username or email already taken'
            );
            done();
          });
      });
      it('should return 201 if the user is created', (done) => {
        request
          .post('/auth/signup')
          .send({
            username: 'test2',
            password: 'password',
            email: 'test2@gmail.com',
          })
          .expect(201)
          .end(async (err, res) => {
            if (err) return done(err);
            should(res.body).have.property(
              'message',
              'User created successfully'
            );
            createdUsers.push(await User.findOne({ name: 'test2' }).exec());
            done();
          });
      });
      it('should be able to login with the new user', (done) => {
        request
          .post('/auth/login')
          .send({ username: 'test2', password: 'password' })
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            should(res.body).have.property('message', 'Login successful');
            done();
          });
      });
    });

    describe('Refresh token', () => {
      it('should return 401 if the refresh token is missing', (done) => {
        request
          .post('/auth/refresh')
          .expect(401)
          .end((err, res) => {
            if (err) return done(err);
            should(res.body).have.property(
              'message',
              'Refresh token is required'
            );
            done();
          });
      });
      it('should return 401 if the refresh token is invalid', (done) => {
        request
          .post('/auth/refresh')
          .set('Cookie', [`${constants.REFRESH_COOKIE_NAME}=invalid`])
          .expect(401)
          .end((err, res) => {
            if (err) return done(err);
            should(res.body).have.property('message', 'Invalid refresh token');
            done();
          });
      });
      it('should return 200 if the refresh token is valid', (done) => {
        request
          .post('/auth/login')
          .send({ username: 'test', password: 'password' })
          .expect(200)
          .end(async (err, res) => {
            if (err) return done(err);
            const refreshToken = res.headers['set-cookie'][1]
              .split('=')[1]
              .split(';')[0];
            request
              .post('/auth/refresh')
              .set('Cookie', [
                `${constants.REFRESH_COOKIE_NAME}=${refreshToken}`,
              ])
              .expect(200)
              .end((err, res) => {
                if (err) return done(err);
                should(res.body).have.property('message', 'Refresh successful');
                done();
              });
          });
      });
      // it('should return a new JWT', (done) => {
      //   request
      //     .post('/auth/login')
      //     .send({ username: 'test', password: 'password' })
      //     .expect(200)
      //     .end(async (err, res) => {
      //       if (err) return done(err);
      //       const JWT = res.headers['set-cookie'][0]
      //         .split('=')[1]
      //         .split(';')[0];
      //       const refreshToken = res.headers['set-cookie'][1]
      //         .split('=')[1]
      //         .split(';')[0];
      //       request
      //         .post('/auth/refresh')
      //         .set('Cookie', [
      //           `${constants.REFRESH_COOKIE_NAME}=${refreshToken}`,
      //         ])
      //         .expect(200)
      //         .end((err, res2) => {
      //           if (err) return done(err);
      //           should(
      //             res2.headers['set-cookie'][0].split('=')[1].split(';')[0]
      //           ).not.equal(JWT);
      //           done();
      //         });
      //     });
      // });
      // it('should return a new refresh token', (done) => {
      //   request
      //     .post('/auth/login')
      //     .send({ username: 'test', password: 'password' })
      //     .expect(200)
      //     .end(async (err, res) => {
      //       if (err) return done(err);
      //       const refreshToken = res.headers['set-cookie'][1]
      //         .split('=')[1]
      //         .split(';')[0];
      //       setTimeout(() => {
      //         request
      //           .post('/auth/refresh')
      //           .set('Cookie', [
      //             `${constants.REFRESH_COOKIE_NAME}=${refreshToken}`,
      //           ])
      //           .expect(200)
      //           .end((err, res2) => {
      //             if (err) return done(err);
      //             should(
      //               res2.headers['set-cookie'][1].split('=')[1].split(';')[0]
      //             ).not.equal(refreshToken);
      //             done();
      //           });
      //       }, 100);
      //     });
      // });
    });
  });

  describe('Authorization', () => {});
});
