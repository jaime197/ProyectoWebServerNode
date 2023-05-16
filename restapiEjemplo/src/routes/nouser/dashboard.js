const { Router } = require('express');
const path = require('path');
const router = Router();
const mysql = require('mysql');
const session = require('express-session');
const CircularJSON = require('circular-json');

// Create a connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'admin',
    password: 'vbnnm123',
    database: 'webservidor'
});

router.get('/nouser/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/nouserdashboard.html'));
});

router.post('/nouser/dashboard', async (req, res) => {
    const action = req.body.action;
    console.log(action);
    const connection = await new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                resolve(connection);
            }
        });
    });

    try {
        if (action === 'register') {
            res.json({ redirectUrl: '/register' });
        } else if (action === 'get_seller') {
            const sql = 'SELECT * FROM comercios';
            try {
                const results = await connection.query(sql);
                console.log(results);
            } catch (err) {
                console.log(err.message);
                res.status(500).json(err.message);
            }
        } else if (action === 'get_seller_city'){
            const city = req.body;
            
            const sql = 'SELECT * FROM comercios WHERE ciudad = ?';
            const value = city;
            try {
                const results = await connection.query(sql, value);
                console.log(results);
            } catch (err) {
                console.log(err.message);
                res.status(500).json(err.message);
            }
        } else if (action === 'get_seller_city_activity'){   
            const city = req.body;
            const activity = req.body;
            
            const sql = 'SELECT * FROM comercios WHERE ciudad = ? AND actividad = ?';
            const values = [city, activity];
            try {
                const results = await connection.query(sql, values);
                console.log(results);
            } catch (err) {
                console.log(err.message);
                res.status(500).json(err.message);
            }
        } 
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    } finally {
        connection.release();
    }
});

module.exports = router;