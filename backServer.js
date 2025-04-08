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
    password: 'proyectojames',
    database: 'basedatosfundacion',
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

// Ruta para obtener estudiantes por institución
app.post('/obtenerEstudiantesPorInstitucion', (req, res) => {
    const { institucion } = req.body;
    const sql = `
    SELECT numDoc, tipoDoc, primerNombre, segundoNombre, primerApellido, segundoApellido
    FROM estudiantes
    WHERE InstitucionEducativa = ?
    `;
    console.log("Institución recibida:", institucion);
    db.query(sql, [institucion], (err, results) => {
      if (err) {
        console.error('Error al obtener estudiantes:', err);
        return res.status(500).json({ error: 'Error en la base de datos' });
      }
      res.json(results);
    });
  });
  
  // Ruta para registrar asistencia
app.post('/registrarAsistencia', (req, res) => {
    const { fecha, institucion, asistencias } = req.body;
  
    if (!fecha || !institucion || !Array.isArray(asistencias) || asistencias.length === 0) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }
  
    // 1. Insertar registro en la tabla "asistencia"
    const sqlAsistencia = 'INSERT INTO asistencia (institucionEducativa, fechaAsistencia, Usuario_numDoc, Usuario_tipoDoc) VALUES (?, ?, ?, ?)';
    const asistenciaValues = [institucion, fecha, "123456789", "CC"];
  
    db.query(sqlAsistencia, asistenciaValues, (err, result) => {
      if (err) {
        console.error('Error al guardar asistencia principal:', err);
        return res.status(500).json({ error: 'Error al guardar la asistencia principal' });
      }
  
      // Obtiene el idAsistencia generado
      const idAsistencia = result.insertId;
  
      // 2. Preparar los valores a insertar en la tabla "asistencia_has_estudiantes".
      const valoresHasEstudiante = asistencias.map(item => [
        idAsistencia,
        item.numDoc,
        item.tipoDoc,
        item.asistio ? 1 : 0
      ]);
  
      const sqlHasEstudiante = 'INSERT INTO asistencia_has_estudiantes (Asistencia_idAsistencia, Estudiantes_numDoc, Estudiantes_tipoDoc, asistio) VALUES ?';
  
      db.query(sqlHasEstudiante, [valoresHasEstudiante], (err2, result2) => {
        if (err2) {
          console.error('Error al guardar asistencia_has_estudiantes:', err2);
          return res.status(500).json({ error: 'Error al guardar los registros de asistencia de estudiantes' });
        }
        res.json({ mensaje: 'Asistencia registrada correctamente' });
      });
    });
  });
  
  app.post('/consultarAsistencia', (req, res) => {
    const { fecha, institucion } = req.body;
  
    const sql = `
      SELECT e.numDoc, e.primerNombre, e.segundoNombre, e.primerApellido, e.segundoApellido, ahe.asistio
      FROM asistencia a
      JOIN asistencia_has_estudiantes ahe ON a.idAsistencia = ahe.Asistencia_idAsistencia
      JOIN estudiantes e ON ahe.Estudiantes_numDoc = e.numDoc
      WHERE a.fechaAsistencia = ? AND a.institucionEducativa = ?
    `;
    
    db.query(sql, [fecha, institucion], (err, results) => {
      if (err) {
        console.error('Error al consultar asistencia:', err);
        return res.status(500).json({ error: 'Error en la consulta' });
      }
      res.json(results);
    });
  });
  

app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000/inicio.html");
});