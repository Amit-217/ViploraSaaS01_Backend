const express = require('express');
const { createTenant, getCurrentTenant } = require('./tenant.controller');
const authenticate = require('../../../common/middlewares/authenticate');

const router = express.Router();

router.post('/', createTenant);
router.get('/me', authenticate, getCurrentTenant);

module.exports = router;
