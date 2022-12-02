const { describe, it, before, after } = require('mocha');
const request = require('supertest');
// const should = require('should');
const { User } = require('../models/user');
const { Chat } = require('../models/chat');
const { UserChat } = require('../models/userChat');
const sinon = require('sinon');
const authMiddleware = require('../middlewares/authentication.middleware');
const should = require('should');
const { Message } = require('../models/message');

describe('HTTP Routes tests', () => {
  const co = [];
  let user;
  // eslint-disable-next-line no-unused-vars
  let otherUser;

  before(async () => {
    require('dotenv').config();
    const setupDB = require('../models');
    await setupDB();

    const _user = await User.create({
      name: 'mochi',
      password: 'Asdf',
      email: 'mochi@cool.com',
    });
    user = _user;
    co.push(_user);

    const _otherUser = await User.create({
      name: 'miki',
      password: 'forzagiuvesiumloremerda',
      email: 'dallerivemiki@gmail.com',
    });
    otherUser = _otherUser;
    co.push(_otherUser);

    const chat = await Chat.create({
      messages: [],
    });
    co.push(chat);

    const userChat = await UserChat.create({
      user: user._id,
      chat: chat._id,
    });
    co.push(userChat);
  });

  after(async () => {
    await Promise.all(co.map((obj) => obj.remove()));
  });

  describe('Filtering the user name', () => {
    it('should return 200', (done) => {
      request
        .get('/api/users')
        .query({ filter: 'mochi' })
        .expect(200)
        .end(() => done());
    });
    it('should return the matching users', (done) => {
      request
        .get('/api/users')
        .query({ filter: 'm' })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.length.should.be.equal(2);
          done();
        });
    });
    it('should return no user', (done) => {
      request
        .get('/api/users')
        .query({ filter: 'bob' })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          res.body.length.should.be.equal(0);
          done();
        });
    });
  });

  describe('Creating a new chat', () => {
    it('should return 406 if id is not valid', (done) => {
      request
        .post('/api/chat')
        .send({ otherID: 'yothisiswrong' })
        .expect(406)
        .end(() => {
          done();
        });
    });
  });
});
