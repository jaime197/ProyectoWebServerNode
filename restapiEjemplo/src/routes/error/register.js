const { Router } = require('express');
const path = require('path');
const router = Router();

router.get('/error/register', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../../public/registerfail.html'));
});

module.exports = router;