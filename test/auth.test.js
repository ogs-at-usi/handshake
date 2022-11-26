const { describe, it } = require('mocha');
const request = require('supertest')('http://localhost:8888');
const should = require('should');

describe('Authentication', () => {
  const loginEndpoint = '/auth/login';

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
          should(res.headers['set-cookie'][0]).containEql('JWT_TOKEN');
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
          should(res.headers['set-cookie'][1]).containEql('REFRESH_TOKEN');
          // check if the cookie REFRESH_TOKEN is HTTP-only
          should(res.headers['set-cookie'][1]).containEql('HttpOnly');
          done();
        });
    });
  });
});

describe('Authorization', () => {});
