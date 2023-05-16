const { Router } = require('express');
const router = Router();
const path = require('path');
const mysql = require('mysql');
const session = require('express-session');

//conexion con la database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'vbnnm123',
    database: 'webservidor'
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

router.post('/login', (req, res) => {
    const action = req.body.action;
    console.log(action);

    if(action == 'login') {
        const { username, password } = req.body;
        connection.query('SELECT * FROM credenciales WHERE username = ?', [username], (error, results, fields) => {
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }

            if (results.length === 0) {
                res.status(404).json({ redirectUrl: '/error/login' });
                return;
            }

            const user = results[0];
            if (user.password !== password) {
                // Password is incorrect
                console.log('incorrect password');
                res.status(401).json({ error: 'Incorrect password' });
                return;
            }

            req.session.userType = user.usertype;
            req.session.username = user.username;
            console.log(req.session.userType);
            console.log(req.session.username);

            if (req.session.userType === 'admin') {
                res.status(200).json({ redirectUrl: '/admin/dashboard' });
            } else if (req.session.userType === 'seller') {
                res.status(200).json({ redirectUrl: '/seller/dashboard' });
            } else if (req.session.userType === 'buyer') {
                res.status(200).json({ redirectUrl: '/buyer/dashboard' });
            }

        });
    } else if (action == 'no_login') {
        res.status(200).json({ redirectUrl: '/nouser/dashboard' });
    }
    
});

module.exports = router;