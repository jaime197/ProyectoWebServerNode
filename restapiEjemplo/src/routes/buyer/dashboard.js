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

router.get('/buyer/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/buyerdashboard.html'));
});

router.post('/buyer/dashboard', async (req, res) => {
    const action = req.body.action;
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
        if (action === 'put') {
            const { email, password, edad, ciudad, intereses, permite_recibir_ofertas } = req.body;

            const sql1 = 'UPDATE users SET email = ?, password = ?, edad = ?, ciudad = ?, intereses = ?, permite_recibir_ofertas = ? WHERE nombre = ?';
            const values1 = [email, password, edad, ciudad, intereses, permite_recibir_ofertas, req.session.username];
            await connection.query(sql1, values1);

            const sql2 = 'UPDATE credenciales SET password = ? WHERE username = ?';
            const values2 = [password, req.session.username];
            await connection.query(sql2, values2);
        
        } else if (action === 'del'){
            const del_name = req.session.username;
            
            const sql1 = 'DELETE FROM users WHERE nombre = ?';
            const values1 = del_name;

            const sql2 = 'DELETE FROM credenciales WHERE username = ?';
            const values2 = del_name;

            try {
                const results1 = await connection.query(sql1, values1);
                const results2 = await connection.query(sql2, values2);
                res.json({ redirectUrl: '/register' });
            } catch (err) {
                console.log(err.message);
                res.send(err.message);
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