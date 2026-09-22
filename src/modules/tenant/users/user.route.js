const express = require('express');
const { createUser, listUsers, getUserById, updateUser, deleteUser } = require('./user.controller');
const authenticate = require('../../../common/middlewares/authenticate');
const authorizeAdmin = require('../../../common/middlewares/authorizeAdmin');

const router = express.Router();

router.post('/', authenticate, authorizeAdmin, createUser);
router.get('/', authenticate, listUsers);
router.get('/:id', authenticate, getUserById);
router.patch('/:id', authenticate, authorizeAdmin, updateUser);
router.delete('/:id', authenticate, authorizeAdmin, deleteUser);

module.exports = router;
