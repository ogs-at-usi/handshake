const express = require('express');
const router = express.Router();
const { UserChat } = require('../models/userChat');
const { ObjectId } = require('mongodb');
const { Chat } = require('../models/chat');
const { Group } = require('../models/group');
const GroupData = require('../client/src/classes/group').Group;
const { joinRooms, io } = require('../serverSocket');

/**
 * Creates new group
 */
router.post('/group', async function (req, res) {
  const { title, membersId } = req.body;

  // fire condition - minimal sanity check
  if (!title || !membersId) return res.status(400).send('not all params').end();
  if (membersId.some((id) => !ObjectId.isValid(id)))
    return res.status(400).send('invalid ObjectsId').end();

  // create chat and the relation userChat for each member
  const titleSanitized = title.replace(/[^a-zA-Z0-9 ]/g, '');
  const chat = await Chat.create({ is_group: true, messages: [] });
  const membersIdWithCreator = [...membersId, req.userId];
  await Promise.all(
    membersIdWithCreator.map(
      async (id) => await UserChat.create({ user: id, chat: chat._id })
    )
  );
  // create group
  const group = await Group.create({ title: titleSanitized, chat: chat._id });

  // join members in chat socket room
  const socketsMembers = (
    await Promise.all(
      membersIdWithCreator.map(async (id) => await io.to(id).fetchSockets())
    )
  ).reduce((acc, val) => acc.concat(val), []);
  joinRooms([chat._id.toString()], socketsMembers);

  // retrieve member objects
  const membersUserChatRelations = await UserChat.find({ chat: chat._id })
    .populate('user')
    .exec();
  const members = membersUserChatRelations.map((ucr) => ucr.user);

  // create group objects to members
  const groupData = new GroupData({
    _idGroup: group._id,
    title: group.title,
    description: group.description,
    members,
    ...chat._doc,
  });

  members.forEach((m) =>
    io.to(m._doc._id.toString()).emit('chats:create', groupData)
  );
  res.status(201).json(chat);
});

module.exports = router;
