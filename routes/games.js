const express = require('express');
const router = express.Router();
const io = require('../serverSocket').io;

const { ObjectId } = require('mongodb');
const { saveMessage } = require('../utils/message.utils');
const EMPTY = "_";

router.post('/:chatId', async function (req, res) {
    const chatId = req.params.chatId;
    if (!ObjectId.isValid(chatId)) {
        return res.status(400).end();
    }

    const messageObj = req.body.message;
    // console.log(messageObj);

    const messageContent = messageObj.content;

    // messageContent is gamename|gamestate|game
    const gameName = messageContent.split('|')[0];
    const gameState = messageContent.split('|')[1];
    let newStatus = null;

    switch (gameName) {
        case 'tictactoe':
            console.log('tictactoe');
            newStatus = await tictactoe(gameState);
            break;
        default:
            console.log('default');
            break;
    }

    if (!newStatus) {
        return res.status(404).end();
    }

    const newMessage = await saveMessage(
        chatId,
        req.userId,
        gameName + '|' + newStatus,
        'GAME'
    );

    io.to(req.params.chatId).emit('messages:create', newMessage);

    if (!newMessage) {
        return res.status(404).end();
    }

    res.status(201).json(newMessage);
});

/**
  * Determine if the board has a winning configuration
  * @param {String} gameState encoding the board slots
  * @returns true, if the game has a winner. false otherwise.
  */
async function tictactoe(gameState) {
    console.log('tictactoe');

    // need to check only for victory
    // const a = getWinner(gameState) !== null;
    const board = Array.from(gameState)
    const matrix = [
        [board[0], board[1], board[2]],
        [board[3], board[4], board[5]],
        [board[6], board[7], board[8]]
    ]

    // check if won by row
    for (let i = 0; i < 3; i++) {
        if (matrix[i][0] !== EMPTY && matrix[i][0] === matrix[i][1] && matrix[i][0] === matrix[i][2]) {
            // return matrix[i][0];
            return gameState + '|1';
        }
    }
    // check if won by column
    for (let i = 0; i < 3; i++) {
        if (matrix[0][i] !== EMPTY && matrix[0][i] === matrix[1][i] && matrix[0][i] === matrix[2][i]) {
            // return matrix[0][i];
            return gameState + '|1';
        }
    }
    // check if won by diagonal
    if (matrix[0][0] !== EMPTY && matrix[0][0] === matrix[1][1] && matrix[0][0] === matrix[2][2]) {
        // return matrix[0][0];
        return gameState + '|1';
    }
    if (matrix[0][2] !== EMPTY && matrix[0][2] === matrix[1][1] && matrix[0][2] === matrix[2][0]) {
        // return matrix[0][2];
        return gameState + '|1';
    }

    return gameState + '|0';
}