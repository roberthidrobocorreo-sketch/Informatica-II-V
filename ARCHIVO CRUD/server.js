const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

const Estudiantes = require("./dataBase.js");
let BD = new Estudiantes("bd.json");

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 1. Menú Principal
app.get('/', (req, res) => {
    res.render('index');
});

// 2. Ver Alumnos Registrados
app.get('/ver', (req, res) => {
    let alumnos = BD.obtenerTodos();
    res.render('ver', { estudiantes: alumnos });
});

// 3. Registrar un Nuevo Alumno

app.get('/registrar', (req, res) => {
    res.render('registrar', { error: null });
});

app.post('/registrar', (req, res) => {
    const cedula = req.body.cedula ? req.body.cedula.trim() : "";
    
    const esValida = /^\d{8}$/.test(cedula);
    if (!esValida) {
        return res.render('registrar', { error: "Error: La cédula debe tener exactamente 8 dígitos numéricos." });
    }

    let alumnos = BD.obtenerTodos();
    const existe = alumnos.some(e => String(e.cedula) === String(cedula));
    
    if (existe) {
        return res.render('registrar', { error: `La cédula ${cedula} ya se encuentra registrada en el sistema.` });
    }

    const nombreCompleto = `${req.body.nombre} ${req.body.apellido}`.trim();
    const nuevo = {
        cedula: cedula,
        nombre: nombreCompleto,
        nota1: parseFloat(req.body.nota1) || 0,
        nota2: parseFloat(req.body.nota2) || 0,
        nota3: parseFloat(req.body.nota3) || 0,
        nota4: parseFloat(req.body.nota4) || 0
    };
    BD.agregar(nuevo);
    res.redirect('/ver');
});

// 4. Modificar Datos del Alumno
app.get('/modificar', (req, res) => {
    const cedulaBuscar = req.query.cedula;
    let alumno = null;
    if (cedulaBuscar) {
        let alumnos = BD.obtenerTodos();
        alumno = alumnos.find(e => String(e.cedula) === String(cedulaBuscar));
    }
    res.render('modificar', { estudiante: alumno, cedulaBuscar: cedulaBuscar });
});

app.post('/modificar', (req, res) => {
    const cedula = req.body.cedula ? req.body.cedula.trim() : "";

    const esValida = /^\d{8}$/.test(cedula);
    
    if (!esValida) {
        return res.send("Error: La cédula debe tener exactamente 8 dígitos numéricos.");
    }

    const actualizados = {
        cedula: cedula,
        nombre: req.body.nombre,
        nota1: parseFloat(req.body.nota1) || 0,
        nota2: parseFloat(req.body.nota2) || 0,
        nota3: parseFloat(req.body.nota3) || 0,
        nota4: parseFloat(req.body.nota4) || 0
    };
    BD.actualizar(cedula, actualizados);
    res.redirect('/ver');
});

// 5. Borrar un Alumno
app.get('/eliminar', (req, res) => {
    const cedulaBuscar = req.query.cedula;
    let alumno = null;
    if (cedulaBuscar) {
        let alumnos = BD.obtenerTodos();
        alumno = alumnos.find(e => String(e.cedula) === String(cedulaBuscar));
    }
    res.render('eliminar', { estudiante: alumno, cedulaBuscar: cedulaBuscar });
});

app.post('/eliminar', (req, res) => {
    BD.eliminar(req.body.cedula);
    res.redirect('/ver');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});