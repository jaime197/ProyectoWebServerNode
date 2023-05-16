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

router.get('/seller/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/sellerdashboard.html'));
});

router.post('/seller/dashboard', async (req, res) => {
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
            const { ciudad, actividad, titulo, resumen, action } = req.body;

            const sql1 = 'UPDATE comercios SET ciudad = ?, actividad = ?, titulo = ?, resumen = ? WHERE nombre = ?';
            const values1 = [ciudad, actividad, titulo, resumen, req.session.username];
            await connection.query(sql1, values1);

            res.status(200).send('Successfully added record');
        } else if (action === 'add_image') {
            const image_url = req.body;

            const sql = 'INSERT INTO comercios (fotos) VALUES (?)';
            const values = image_url;

            try {
                const results = await connection.query(sql, values);
            } catch (err) {
                console.log(err.message);
                res.status(500).send(err.message);
            }
        } else if (action === 'add_text'){
            const text = req.body;
            
            const sql = 'INSERT INTO comercios (textos) VALUES (?)';
            const values = text;

            try {
                const results1 = await connection.query(sql, values);
            } catch (err) {
                console.log(err.message);
                res.status(500).send(err.message);
            }
        } else if (action === 'del'){   
            const del_name = req.session.username;
            
            const sql1 = 'DELETE FROM comerciosadmin WHERE nombre = ?';
            const values1 = [del_name];

            const sql2 = 'DELETE FROM comercios WHERE username = ?';
            const values2 = [del_name];

            const sql3 = 'DELETE FROM credenciales WHERE username = ?';
            const values3 = [del_name];

            try {
                const results1 = await connection.query(sql1, values1);
                const results2 = await connection.query(sql2, values2);
                const results3 = await connection.query(sql3, values3);
            } catch (err) {
                console.log(err.message);
                res.status(500).send(err.message);
            }
        } else if (action === 'get_users'){   
            const name = req.session.username;
            const sql1 = 'SELECT ciudad FROM comercios WHERE name = ?';
            const values1 = name;
            connection.query(sql1, values1, (err, result) => {
                if (err) throw err;
                const ciudad = result[0].ciudad;
            });

            const sql2 = 'SELECT * FROM users WHERE ciudad = ? AND permite_recibir_ofertas = 1';
            const values2 = name;

            const users = [];

            connection.query(sql2, values2, (error, results, fields) => {
                if (error) {
                    res.status(500).send(error.message);;
                    connection.end();
                    return;
                }
                
                // loop through the results and push them to the users array
                for (let i = 0; i < results.length; i++) {
                    users.push(results[i]);
                    console.log(users);
                }
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    } finally {
        connection.release();
    }
});

module.exports = router;