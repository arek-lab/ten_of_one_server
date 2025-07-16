const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authentication');
const { getOpinion } = require('../controllers/getOpinionController');

router.post('/', authenticateUser, getOpinion);

module.exports = router;
