import express from 'express';
import { productos } from './Data/products.js';


const app = express();
const port = 3000;

app.use (express.json)

const categoriasValidas = ['electrónica', 'electronica', 'hogar', 'oficina'];

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Listar activo 
app.get('/api/productos', (req, res) => {

    let registrosActivos = productos.filter(p => p.Activo === true)
    res.json(registrosActivos);

});

// Buscar por ID 
app.get('/api/productos/:id', (req, res) => {

    let id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json(

            {
                "error": "Validación fallida",
                "detalles": [
                    "Parametro no valido",
                ]
            }

        );
    }

    let registrosActivos = productos.find(p => p.Activo === true && p.Id === id)

    if (registrosActivos === undefined) {
           return res.status(404).json(

            {
                "error": "Registro NO encontrado",
                "detalles": [
                    "No se encontro el registro",
                ]
            }

        );
    }

    res.json( {
                "exito": "Registro encontrado",
                "detalles": registrosActivos 
            });

});

// Crear un producto 
app.post('/api/productos', (req, res) => {

    const { Nombre, Categoría, PrecioUnitario, Stock } = req.body;
  
    if (Nombre === undefined || PrecioUnitario === undefined || Categoría === undefined ){
        return res.status(400).json({
            "error": "Validación fallida",
            "detalles": [
                "Faltan Valores requeridos"
            ]
        });
    }

    if (typeof Nombre !== 'string' || Nombre.trim() === "") {
        return res.status(400).json({
            "error": "Validación fallida",
            "detalles": [
                "El nombre es obligatorio y no puede estar vacío"
            ]
        });
    }

    let precioValidado = Number(PrecioUnitario);

    if (isNaN(precioValidado) || precioValidado <= 0) {
        return res.status(400).json({
            "error": "Validación fallida",
            "detalles": [
                "El precio debe ser un número válido y debe ser mayor a 0"
            ]
        });
    }

    let categoriaRecibida = Categoría;
    const categoriasValidas = ['electrónica', 'electronica', 'hogar', 'oficina'];

    if (!categoriaRecibida || !categoriasValidas.includes(categoriaRecibida.toLowerCase().trim())) {
        return res.status(400).json({
            "error": "Validación fallida",
            "detalles": [
                "Categoría no válida. Valores permitidos: Electrónica, Hogar o Oficina"
            ]
        });
    }    



    const nuevoProducto = {
        Id: productos.length + 1, 
        Nombre: Nombre.trim(),
        Categoría: categoriaRecibida,
        PrecioUnitario: precioValidado,
        Stock: parseInt(Stock) >= 0 ? parseInt(Stock) : 0,
        Activo: true 
    };

    productos.push(nuevoProducto);

    res.status(201).json({
        "exito": "Registro creado",
        "detalles": nuevoProducto
    });

});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});