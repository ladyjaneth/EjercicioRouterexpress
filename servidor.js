const { json } = require('express');
const express = require('express');
const app = express();
app.use(express.json()); //para que pueda aceptar json en la aplicación
app.use(express.urlencoded({extended:true}));

const { Router } = express;
const router = new Router();

const Contenedor = require('./manejadorarchivos');
const contenedor = new Contenedor('productos.txt');

const server = app.listen('8080',()=>{
    console.log('escuchando en el puerto 8080');
})

server.on('error', error=>{ 
    console.log('hubo un error:'+error);
});


router.get('/',  async (req, res)=>{
    res.json(await contenedor.getAll());
});

router.get('/:id', async (req, res)=>{
    const id = Number(req.params.id);
    const producto = await contenedor.getById(id);
    const respuesta = producto == null ? {error:'producto no encontrado'} : producto;
    res.json(respuesta); //las api todas las respuestas las da en json 
});

router.post('/', async (req, res)=>{//req peticiones
    const producto = req.body; //recibo el producto
    producto.id = await contenedor.save(producto);//recibe la estructura del producto, devuelve un id save 
    res.json(producto);
});

router.put('/:id', (req, res)=>{
    const id = Number(req.params.id);
    const producto = req.body;
    producto.id = id;
    contenedor.update(producto);
    res.json({mensaje:'Producto actualizado'});
});

router.delete('/:id', async (req, res)=>{
    const id = Number(req.params.id);
    const existeProducto = await contenedor.getById(id);
    let respuesta;
    if(existeProducto){
        const esEliminado = await contenedor.deleteById(id);
        respuesta = {mensaje: esEliminado ? 'Producto eliminado' : 'Producto no eliminado'};
    }else{
        respuesta = {error:'producto no encontrado'};
    }
    
    res.json(respuesta);
});

app.use('/api/productos', router);