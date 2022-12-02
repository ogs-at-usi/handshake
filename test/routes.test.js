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
  let otherUser;
  let noUser;
  let app;
  let createdChatId;

  before(async () => {
    try {
      require('dotenv').config();
      const setupDB = require('../models');
      await setupDB();

      await User.deleteMany();
      await Chat.deleteMany();
      await Message.deleteMany();
      await UserChat.deleteMany();

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

      noUser = await User.create({
        name: 'gief',
        password: 'mewhenthe',
        email: 'fej@usi.com',
      });
      co.push(noUser);

      const chat = await Chat.create({
        messages: [],
      });
      co.push(chat);

      const userChat = await UserChat.create({
        user: user._id,
        chat: chat._id,
      });
      co.push(userChat);

      const userChat2 = await UserChat.create({
        user: otherUser._id,
        chat: chat._id,
      });
      co.push(userChat2);
    } catch (e) {
      console.log(e);
      await Promise.all(co.map((obj) => obj.remove()));
    }

    sinon.stub(authMiddleware, 'authenticate').callsFake((req, res, next) => {
      req.userId = user._id.toString();
      next();
    });

    app = require('../app');
  });

  after(async () => {
    await Promise.all(co.map((obj) => obj.remove()));
  });

  describe('Filtering the user name', () => {
    it('should return 200', (done) => {
      request(app)
        .get('/api/users')
        .query({ filter: 'mochi' })
        .expect(200)
        .end((err) => {
          done(err);
        });
    });
    it('should return the matching users', (done) => {
      request(app)
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
      request(app)
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
    it('should return 406 if the id is not valid', (done) => {
      request(app)
        .post('/api/chat')
        .send({ otherId: 'yothisiswrong' })
        .expect(406)
        .end((err) => {
          done(err);
        });
    });
    it('should return 406 if the is no user', (done) => {
      request(app)
        .post('/api/chat')
        .send({ otherId: '5e63c3a5e4232e4cd0274ae1' })
        .expect(406)
        .end((err) => {
          done(err);
        });
    });
    it('should return a common chat if it already exists', (done) => {
      Chat.find({})
        .count()
        .exec((err, numberOfChats) => {
          if (err) return done(err);
          request(app)
            .post('/api/chat')
            .send({ otherId: otherUser._id.toString() })
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);
              res.body.length.should.be.greaterThan(0);

              Chat.find({})
                .count()
                .exec((err, newNumberOfChats) => {
                  if (err) return done(err);
                  numberOfChats.should.be.equal(newNumberOfChats);
                  done();
                });
            });
        });
    });
    it('should return a new chat if it does not exist', (done) => {
      Chat.find({})
        .count()
        .exec((err, numberOfChats) => {
          if (err) return done(err);
          request(app)
            .post('/api/chat')
            .send({ otherId: noUser._id.toString() })
            .expect(201)
            .end((err, res) => {
              if (err) return done(err);
              console.log(res.body._id);
              createdChatId = res.body._id.toString();
              should(res.body).have.property('messages', []);

              Chat.find({})
                .count()
                .exec((err, newNumberOfChats) => {
                  if (err) return done(err);
                  newNumberOfChats.should.be.equal(numberOfChats + 1);
                  done();
                });
            });
        });
    });
  });

  describe('Create a new message', () => {
    it('should return 406 if the ID is not valid', (done) => {
      const chatId = 'yothisiswrong';
      request(app)
        .post(`/api/chat/${chatId}/messages`)
        .send()
        .expect(406)
        .end((err) => {
          done(err);
        });
    });
    it('should return 404 if the chat does not exist', (done) => {
      const chatId = '9e63c3a5e4232e4cd0274ae1';
      request(app)
        .post(`/api/chat/${chatId}/messages`)
        .send({ message: { type: 'TEXT', content: 'mikiegey' } })
        .expect(404)
        .end((err) => {
          done(err);
        });
    });
    it('should return 400 if type invalid', (done) => {
      const chatId = '9e63c3a5e4232e4cd0274ae1';
      request(app)
        .post(`/api/chat/${chatId}/messages`)
        .send({ message: { type: 'string', content: 'mikiegey' } })
        .expect(400)
        .end((err) => {
          done(err);
        });
    });
    it('should return 400 if no written content', (done) => {
      const chatId = '9e63c3a5e4232e4cd0274ae1';
      request(app)
        .post(`/api/chat/${chatId}/messages`)
        .send({ message: { type: 'TEXT', content: '' } })
        .expect(400)
        .end((err) => {
          done(err);
        });
    });
    it('should return 400 if missing content', (done) => {
      const chatId = '9e63c3a5e4232e4cd0274ae1';
      request(app)
        .post(`/api/chat/${chatId}/messages`)
        .send({ message: { type: 'TEXT' } })
        .expect(400)
        .end((err) => {
          done(err);
        });
    });
    it('should create a new message in the database', (done) => {
      Message.find({})
        .count()
        .exec((err, numberOfMessages) => {
          if (err) return done(err);
          const chatId = createdChatId;
          request(app)
            .post(`/api/chat/${chatId}/messages`)
            .send({ message: { type: 'TEXT', content: 'mikiegey' } })
            .expect(201)
            .end((err, res) => {
              if (err) return done(err);
              should(res.body).have.property('chat', chatId);

              Message.find({})
                .count()
                .exec((err, newNumberOfMessages) => {
                  if (err) return done(err);
                  newNumberOfMessages.should.be.equal(numberOfMessages + 1);
                  done();
                });
            });
        });
    });
  });
});
