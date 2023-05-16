const { Router } = require('express');
const router = Router();
const path = require('path');
const mysql = require('mysql');

//conexion con la database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'vbnnm123',
    database: 'webservidor'
});

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/register.html'));
});

router.post('/register', (req, res) => {
    const { username, password } = req.body;
    
    connection.connect();

    //checking if user is already registered
    connection.query('SELECT * FROM credenciales WHERE username = ?', [username], (error, results, fields) => {
        if (error) throw error;

    
        if (results.length === 0) {
            // Username does not exist in the database
            connection.query('INSERT INTO credenciales (username, password, usertype) VALUES (?, ?, \'buyer\')', [username, password], (error, results, fields) => {
                if (error) {
                    console.log(error.message);
                }
                req.session.usertype = 'buyer';
                req.session.username = username;
                res.status(200).json({ redirectUrl: '/buyer/dashboard' });
                return;
            });
        }
        else {
            res.status(404).json({ redirectUrl: '/error/register' });
        }
        connection.end();   
    });  
});

module.exports = router;