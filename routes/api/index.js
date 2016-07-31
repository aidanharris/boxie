const express = require('express');
const router = express.Router();
const app = express();

const _users = require('./users')(router);

router.get('/', (req, res) => {
    res.json({status: 200, message: "OK"});
});

module.exports = router;
