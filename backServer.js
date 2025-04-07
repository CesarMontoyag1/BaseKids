const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

const path = require('path');

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// correr esta ruta que es en donde esta el servidor
// http://localhost:3000/login.html

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Marien_06',
    database: 'BaseDatosFundacion',
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database.');
});

app.post('/login', (req, res) => {
    const { usuario, password } = req.body;

    const query = `
        SELECT * FROM Usuario
        WHERE (username = ? OR email = ?) AND password = ?
    `;

    db.query(query, [usuario, usuario, password], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Error interno del servidor');
        }

        console.log("Resultados de la consulta:", results); // 🔍

        if (results.length > 0) {
            const user = results[0];
            if (user.rol === 'administrativo') {
                res.redirect('/menuAdmin.html');
            } else if (user.rol === 'profesor') {
                res.redirect('/menuProfe.html');
            } else {
                res.status(403).send('Acceso denegado');
            }
        } else {
            res.status(401).send('Credenciales incorrectas');
        }
    });
});

app.post('/buscarEstudiante', (req, res) => {
    const { documento } = req.body;

    const query = `
        SELECT * FROM Estudiantes
        WHERE numDoc = ?
    `;

    db.query(query, [documento], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Error interno del servidor');
        }

        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).send('Estudiante no encontrado');
        }
    });
});

app.post('/agregarEstudiante', (req, res) => {
    const {
        numDoc, tipoDoc, primerNombre, segundoNombre, primerApellido, segundoApellido,
        genero, fechaNacimiento, estadoCivil, grupoEtnico, factorVulnerabilidad,
        paisNacimiento, municipioNacimiento, municipioResidencia, direccionResidencia,
        zonaEstudiante, mundo, modalidad, dias, horarioInicio, horarioFin,
        codigoDaneIE, subregionIE, municipioIE, institucionEducativa, codigoDaneSede,
        sede, grado, jornada, nit, proveedor
    } = req.body;

    console.log('Datos recibidos:', req.body); // Imprimir datos en la consola del servidor

    const query = `
        INSERT INTO estudiantes (
            numDoc, tipoDoc, primerNombre, segundoNombre, primerApellido, segundoApellido,
            genero, fechaNacimiento, estadoCivil, grupoEtnico, factorVulnerabilidad,
            paisNacimiento, municipioNacimiento, municipioResidencia, direccionResidencia,
            zonaEstudiante, mundo, modalidad, dias, horarioInicio, horarioFin,
            codigoDaneIE, subregionIE, municipioIE, institucionEducativa, codigoDaneSede,
            sede, grado, jornada, nit, proveedor
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [
        numDoc, tipoDoc, primerNombre, segundoNombre, primerApellido, segundoApellido,
        genero, fechaNacimiento, estadoCivil, grupoEtnico, factorVulnerabilidad,
        paisNacimiento, municipioNacimiento, municipioResidencia, direccionResidencia,
        zonaEstudiante, mundo, modalidad, dias, horarioInicio, horarioFin,
        codigoDaneIE, subregionIE, municipioIE, institucionEducativa, codigoDaneSede,
        sede, grado, jornada, nit, proveedor
    ], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
        res.json({ success: true, message: 'Estudiante agregado exitosamente' });
    });
});

app.post('/editarEstudiante', (req, res) => {
    const {
        numDoc, tipoDoc, primerNombre, segundoNombre, primerApellido, segundoApellido,
        genero, fechaNacimiento, estadoCivil, grupoEtnico, factorVulnerabilidad,
        paisNacimiento, municipioNacimiento, municipioResidencia, direccionResidencia,
        zonaEstudiante, mundo, modalidad, dias, horarioInicio, horarioFin,
        codigoDaneIE, subregionIE, municipioIE, institucionEducativa, codigoDaneSede,
        sede, grado, jornada, nit, proveedor
    } = req.body;

    // Validar y asignar valores por defecto si están vacíos
    const fechaNacimientoValida = fechaNacimiento || null;
    const horarioInicioValido = horarioInicio || null;

    const query = `
        UPDATE estudiantes
        SET tipoDoc = ?, primerNombre = ?, segundoNombre = ?, primerApellido = ?, segundoApellido = ?,
            genero = ?, fechaNacimiento = ?, estadoCivil = ?, grupoEtnico = ?, factorVulnerabilidad = ?,
            paisNacimiento = ?, municipioNacimiento = ?, municipioResidencia = ?, direccionResidencia = ?,
            zonaEstudiante = ?, mundo = ?, modalidad = ?, dias = ?, horarioInicio = ?, horarioFin = ?,
            codigoDaneIE = ?, subregionIE = ?, municipioIE = ?, institucionEducativa = ?, codigoDaneSede = ?,
            sede = ?, grado = ?, jornada = ?, nit = ?, proveedor = ?
        WHERE numDoc = ?
    `;

    db.query(query, [
        tipoDoc, primerNombre, segundoNombre, primerApellido, segundoApellido,
        genero, fechaNacimientoValida, estadoCivil, grupoEtnico, factorVulnerabilidad,
        paisNacimiento, municipioNacimiento, municipioResidencia, direccionResidencia,
        zonaEstudiante, mundo, modalidad, dias, horarioInicioValido, horarioFin,
        codigoDaneIE, subregionIE, municipioIE, institucionEducativa, codigoDaneSede,
        sede, grado, jornada, nit, proveedor, numDoc
    ], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
        res.json({ success: true, message: 'Estudiante editado exitosamente' });
    });
});

app.post('/eliminarEstudiante', (req, res) => {
    const { numDoc } = req.body;

    const query = `
        DELETE FROM estudiantes
        WHERE numDoc = ?
    `;

    db.query(query, [numDoc], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
        res.json({ success: true, message: 'Estudiante eliminado exitosamente' });
    });
});


app.post('/agregarUsuario', (req, res) => {
    const {
        nombre, apellidos, tipoDocumento, numeroDocumento, rol, username, password, email
    } = req.body;

    const query = `
        INSERT INTO usuario (
            numDoc, tipoDoc, username, email, password, rol, nombre, apellido
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [
        numeroDocumento, tipoDocumento, username, email, password, rol, nombre, apellidos
    ], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
        res.json({ success: true, message: 'Usuario agregado exitosamente' });
    });
});
app.post('/eliminarUsuario', (req, res) => {
    const { numDoc } = req.body;

    const query = `
        DELETE FROM usuario
        WHERE numDoc = ?
    `;

    db.query(query, [numDoc], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        res.json({ success: true, message: 'Usuario eliminado exitosamente' });
    });
});

app.post('/editarUsuario', (req, res) => {
    const {
        numDoc, tipoDoc, nombre, apellido, username, email, password, rol
    } = req.body;

    const query = `
        UPDATE usuario
        SET tipoDoc = ?, nombre = ?, apellido = ?, username = ?, email = ?, password = ?, rol = ?
        WHERE numDoc = ?
    `;

    db.query(query, [
        tipoDoc, nombre, apellido, username, email, password, rol, numDoc
    ], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
        res.json({ success: true, message: 'Usuario editado exitosamente' });
    });
});

app.post('/buscarUsuario', (req, res) => {
    const { documento } = req.body;

    const query = `
        SELECT * FROM usuario
        WHERE numDoc = ?
    `;

    db.query(query, [documento], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Error interno del servidor');
        }

        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    });
});

app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000/inicio.html");
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});