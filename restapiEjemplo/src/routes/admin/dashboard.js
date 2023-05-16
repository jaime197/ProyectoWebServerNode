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

router.get('/admin/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/admindashboard.html'));
});

router.post('/admin/dashboard', async (req, res) => {
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
        if (action === 'add') {
            const { name, cif, address, email, password, telefono } = req.body;

            const sql1 = 'INSERT INTO comerciosadmin (nombre, cif, direccion, email, telefono) VALUES (?, ?, ?, ?, ?)';
            const values1 = [name, cif, address, email, telefono];
            await connection.query(sql1, values1);

            const sql2 = 'INSERT INTO credenciales (username, password, usertype) VALUES (?, ?, ?)';
            const values2 = [name, password, 'seller'];
            await connection.query(sql2, values2);

            res.status(200).send('Successfully added record');
        } else if (action === 'get') {
            const { get_name } = req.body;

            const sql = 'SELECT * FROM comerciosadmin WHERE nombre = ?';
            const values = [get_name];

            try {
                const results = await connection.query(sql, values);
                const plainResults = CircularJSON.stringify(results);
                //console.log(plainResults);
                res.status(200).send(plainResults);
            } catch (err) {
                console.log(err.message);
                res.status(500).json(err.message);
            }
        } else if (action === 'put'){
            const { put_name, new_name, new_cif, new_address, new_email, new_password, new_telefono } = req.body;
            
            const sql1 = 'UPDATE comerciosadmin SET nombre = ?, cif = ?, direccion = ?, email = ?, telefono = ? WHERE nombre = ?';
            const values1 = [new_name, new_cif, new_address, new_email, new_telefono, put_name];

            const sql2 = 'UPDATE credenciales SET username = ?, password = ? WHERE username = ?';
            const values2 = [new_name, new_password, put_name];

            try {
                const results1 = await connection.query(sql1, values1);
                const results2 = await connection.query(sql2, values2);
                console.log(results1);  
                console.log(results2);
            } catch (err) {
                console.log(err.message);
                res.status(500).json(err.message);
            }
        } else if (action === 'del'){
            const { del_name } = req.body;
            
            const sql1 = 'DELETE FROM comerciosadmin WHERE nombre = ?';
            const values1 = [del_name];

            const sql2 = 'DELETE FROM credenciales WHERE username = ?';
            const values2 = [del_name];

            try {
                const results1 = await connection.query(sql1, values1);
                const results2 = await connection.query(sql2, values2);
                console.log(results1);  
                console.log(results2);
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