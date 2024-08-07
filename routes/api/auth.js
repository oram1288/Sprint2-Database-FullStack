const bcrypt = require('bcrypt');
const uuid = require('uuid');
const router = require('express').Router();
const dal = require('../../services/p.auth.dal');
// const dal = require('../../services/m.auth.dal');

// api/auth/:id
router.get('/:id', async (req, res) => {
    if (DEBUG) console.log('ROUTE: /api/auth/:id GET ' + req.url);
    try {
        const aLogin = await dal.getLoginById(req.params.id); 
        if (!aLogin) {
            res.status(404).json({ message: "Not Found", status: 404 });
        } else {
            res.json(aLogin);
        }
    } catch (error) {
        console.error(error);
        res.status(503).json({ message: "Service Unavailable", status: 503 });
    }
});

// Reset the password
router.patch('/:id', async (req, res) => {
    if (DEBUG) console.log('ROUTE: /api/auth PATCH ' + req.params.id);
    try {
        const aLogin = await dal.getLoginById(req.params.id); 
        if (!aLogin) {
            res.status(404).json({ message: "Not Found", status: 404 });
        } else {  
            try {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                await dal.patchLogin(req.params.id, aLogin.username, hashedPassword, aLogin.email);
                res.status(200).json({ message: "OK", status: 200 });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Internal Server Error", status: 500 });
            }
        }   
    } catch (error) {
        console.error(error);
        res.status(503).json({ message: "Service Unavailable", status: 503 });
    }
});

// Delete the login 
router.delete('/:id', async (req, res) => {
    if (DEBUG) console.log('ROUTE: /api/auth DELETE ' + req.params.id);
    try {
        await dal.deleteLogin(req.params.id);
        res.status(200).json({ message: "OK", status: 200 });
    } catch (error) {
        console.error(error);
        res.status(503).json({ message: "Service Unavailable", status: 503 });
    }
});

module.exports = router;
