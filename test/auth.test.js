const { describe, it, before, after } = require('mocha');
const request = require('supertest')('http://localhost:8888');
const should = require('should');
const { hashPassword } = require('../utils/auth.utils');
const { User } = require('../models/user');
const setupDB = require('../models');
const constants = require('../constants/auth.constants');

describe('Authentication/Authorization tests', () => {
  const loginEndpoint = '/auth/login';

  let createdUser = null;

  before(async () => {
    await setupDB();
    // Create a user in the database
    createdUser = await User.create({
      name: 'test',
      password: hashPassword('password'),
    });
  });

  after(async () => {
    // Remove the user from the database
    return createdUser.remove();
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
          .post('/auth/register')
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
          .post('/auth/register')
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
          .post('/auth/register')
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
          .post('/auth/register')
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
    });
  });

  describe('Authorization', () => {});
});
