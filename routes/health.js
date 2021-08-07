var express = require('express');
var router = express.Router();
var db = require('../models');

/* GET health check */
router.get('/', async function (req, res, next) {
    try {
        await db.sequelize.authenticate();
        console.log('Connection has been established successfully.');
        res.sendStatus(200)
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        res.sendStatus(500)
    }
});

module.exports = router;
