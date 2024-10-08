var router = require('express').Router();
const mDal = require('../../services/m.fulltext.dal');
const pDal = require('../../services/p.fulltext.dal');
const myEventEmitter = require('../../services/logEvents.js');
const keyword = require('../../services/p.keywords.dal'); // Ensure this is correctly imported

// api/full/m/:text
router.get('/m/:text', async (req, res) => {
    if (DEBUG) console.log('ROUTE: /api/full/m/ GET ' + req.params.text);
    try {
        let theText = await mDal.getFullText(req.params.text);
        if (theText.length === 0) {
            res.statusCode = 404;
            res.json({ message: "Not Found", status: 404 });
        } else {
            let recordId = await keyword.addKeyword(req.session.user._id, req.params.text, 'mongodb', theText.length);
            myEventEmitter.emit('event', 'api.fulltext.router.get /api/full/m/:text', 'INFO', `Mongodb full text for ${req.params.text} was displayed.`);
            res.json(theText);
        }
    } catch (error) {
        console.error(error); // Log error details for debugging
        myEventEmitter.emit('event', 'api.fulltext.router.get /api/full/m/:text', 'ERROR', `Error fetching MongoDB full text: ${error.message}`);
        res.statusCode = 503;
        res.json({ message: "Service Unavailable", status: 503 });
    }
});

// api/full/p/:text
router.get('/p/:text', async (req, res) => {
    if (DEBUG) console.log('ROUTE: /api/full/p/ GET ' + req.params.text);
    try {
        let theText = await pDal.getFullText(req.params.text);
        if (theText.length === 0) {
            res.statusCode = 404;
            res.json({ message: "Not Found", status: 404 });
        } else {
            let recordId = await keyword.addKeyword(req.session.user._id, req.params.text, 'postgresql', theText.length);
            myEventEmitter.emit('event', 'api.fulltext.router.get /api/full/p/:text', 'INFO', `Postgresql full text for ${req.params.text} was displayed.`);
            res.json(theText);
        }
    } catch (error) {
        console.error(error); // Log error details for debugging
        myEventEmitter.emit('event', 'api.fulltext.router.get /api/full/p/:text', 'ERROR', `Error fetching PostgreSQL full text: ${error.message}`);
        res.statusCode = 503;
        res.json({ message: "Service Unavailable", status: 503 });
    }
});

module.exports = router;
