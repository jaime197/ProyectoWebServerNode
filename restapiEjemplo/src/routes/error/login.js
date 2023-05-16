const { Router } = require('express');
const path = require('path');
const router = Router();

router.get('/error/login', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../../public/loginfail.html'));
});

module.exports = router;