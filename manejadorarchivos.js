const fs = require('fs');
class Contenedor {
    constructor(nombreArchivo){
        this.nombreArchivo = './'+nombreArchivo;
        fs.writeFileSync(this.nombreArchivo, '[]', error => {
            console.log(`Error al crear el archivo ${nombreArchivo}`);
        });
    }

    async save(producto){
        try {
            const arrayProductos = await this.getAll();            
            producto.id = arrayProductos.length +1;
            arrayProductos.push(producto);
            await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(arrayProductos));
        } catch (error) {
            producto.id = 0;
            console.log('Error al agregar el producto al archivo' + error);
        }        
        return producto.id;
    }

    async update(producto){
        try{
            //encomntrar el producto
            const productos = await this.getAll();
            const productosActualizado = productos.map(productoBusq => {
                if(productoBusq.id == producto.id){
                    productoBusq = producto;
                }
                return productoBusq;
            });
            //productosActualizado = productos.map(productoBusq => productoBusq.id == producto.id ? producto: productoBusq);
            await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(productosActualizado));
        }catch(error){
            console.log('Error al actualizar el producto el archivo' + error);
        }
    }



    async getById(id){
        let producto = null;
        try {
            const arrayProductos = await this.getAll();
            const productoEncontrado = await arrayProductos.find(producto => producto.id == id);
            producto = await productoEncontrado == -1 ? null : productoEncontrado;
        } catch (error) {
            console.log(`Error al buscar producto por id ${id}`);
        }

        return producto;
    }

    async getAll(){
        let arrayProductos = [];
        try{
            const archivoProductos = await fs.promises.readFile(this.nombreArchivo);
            arrayProductos = await JSON.parse(archivoProductos);
        }catch(error){
            console.log(`Error al leer el archivo ${this.nombreArchivo} ${error}`);
        }

        return arrayProductos;
    }

    async deleteById(id){
        let productosNoEliminados = [];
        let productos = [];
        try {
            productos = await this.getAll();
            const producto = await this.getById(id);
            productosNoEliminados = await productos.filter(productoBusq => {
                if(productoBusq.id != producto.id)
                    return productoBusq;
            });
            await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(productosNoEliminados));
        } catch (error) {
            console.log(`Error al eliminar el producto del archivo por el id ${id} ${error}`);
        }
        return productosNoEliminados.length != productos.length || productos.length == 0;
    }

    async deleteAll(){
        try {
            await fs.promises.writeFile(this.nombreArchivo, '[]');
            console.log('Se han eliminado los productos');
        } catch (error) {
            console.log('Error al eliminar los productos');
        }
    }

}

module.exports = Contenedor; //exportar la Clase Contenedor