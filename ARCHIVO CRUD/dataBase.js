const fs = require('fs');
const path = require('path');

class Estudiantes {
    constructor(nombreArchivo = "bd.json") {
        this.ruta = path.join(__dirname, nombreArchivo);
        this.inicializar();
    }

    inicializar() {
        if (!fs.existsSync(this.ruta)) {
            fs.writeFileSync(this.ruta, JSON.stringify([], null, 2), 'utf-8');
        }
    }

    obtenerTodos() {
        try {
            const contenido = fs.readFileSync(this.ruta, 'utf-8');
            return JSON.parse(contenido) || [];
        } catch (error) {
            console.error("Error al leer la base de datos:", error);
            return [];
        }
    }

    guardarTodo(lista) {
        try {
            fs.writeFileSync(this.ruta, JSON.stringify(lista, null, 2), 'utf-8');
        } catch (error) {
            console.error("Error al guardar en la base de datos:", error);
        }
    }

    agregar(nuevoEstudiante) {
        const lista = this.obtenerTodos();
        lista.push(nuevoEstudiante);
        this.guardarTodo(lista);
    }

    actualizar(cedula, datosActualizados) {
        let lista = this.obtenerTodos();
        const index = lista.findIndex(e => String(e.cedula) === String(cedula));
        if (index !== -1) {
            lista[index] = datosActualizados;
            this.guardarTodo(lista);
            return true;
        }
        return false;
    }

    eliminar(cedula) {
        let lista = this.obtenerTodos();
        lista = lista.filter(e => String(e.cedula) !== String(cedula));
        this.guardarTodo(lista);
    }
}

module.exports = Estudiantes;