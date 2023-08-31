import express from 'express';
import ProductManager from '../dao/ProductManager.js';

const productsRouter = express.Router();
const PM = new ProductManager();


//POST agregar un producto
productsRouter.post('/', async (req, res) => {

  let {title, description, code, price, status, stock, category, thumbnails} = req.body;
    // Validar los campos requeridos
  if (!product.title){
      res.status(400).send({status:"error", message:"Error! No se cargó el campo Title!"});
      return false;
  }
  if (!product.description){
    res.status(400).send({status:"error", message:"Error! No se cargó el campo Description!"});
    return false;
  }
  if (!product.code){
  res.status(400).send({status:"error", message:"Error! No se cargó el campo Code!"});
  return false;
  }
  if (!product.price){
  res.status(400).send({status:"error", message:"Error! No se cargó el campo Price!"});
  return false;
  }

  status = !status && true;

  if (!product.stock){
  res.status(400).send({status:"error", message:"Error! No se cargó el campo Stock!"});
  return false;
  }

  if (!product.category){
  res.status(400).send({status:"error", message:"Error! No se cargó el campo Category!"});
  return false;
  }

  if (!product.thumbnails){
  res.status(400).send({status:"error", message:"Error! No se cargó el campo Thumbnails!"});
  return false;
  } else if ((!Array.isArray(thumbnails)) || (thumbnails.length == 0)) {
  res.status(400).send({status:"error", message:"Error! Debe ingresar al menos una imagen!"});
  return false;
  }
  
  let product = req.body({title, description, code, price, stock, category, thumbnails});
  await PM.addProduct(product);
    if (result) {
      res.send({status:"ok", message:"El Producto se agregó correctamente!"});
  } else {
      res.status(500).send({status:"error", message:"Error! No se pudo agregar el Producto!"});
  }
    res.status(201).send({message:"Producto agregado!"});
  
});

//GET obtener un producto por id (pid)
productsRouter.get('/:pid', async (req, res) => {
    let pid = req.params.pid;
    try {
      const product = await PM.getProductById(pid);
      if (product) {
        res.status(200).send({product});
      } else {
        res.status(404).send({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      res.status(500).send({ error: 'Error interno del servidor' });
    }
  });
  
 //Get obtener listado de productos
productsRouter.get('/', async (req, res) => {
  try {
    const products = await PM.getProducts(req.query);
    res.send({products});
  } catch (error) {
    res.status(500)({ error: 'Error interno del servidor' });
  }
});

// GET para la vista en tiempo real
productsRouter.get('/realtimeproducts', (req, res) => {
  const productData = fs.readFileSync('productos.json', 'utf8');
  const products = JSON.parse(productData);
  res.render('realTimeProducts', { products });
});


//PUT actualizar un producto por id (pid)
productsRouter.put('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const updatedProduct = req.body;
    try {
      await PM.updateProduct(pid, updatedProduct);
      res.status(200).send({ message:"El Producto se actualizó correctamente!"});;
    } catch (error) {
      res.status(500).send({ error:"Fallo al actualizar prodcuto" });
    }
  });

// DELETE para eliminar producto por id (pid)
productsRouter.delete('/:pid', async (req, res) => {
    const pid = req.params.pid;
    try {
      await PM.deleteProduct(pid);
      res.send({message:'Producto eliminado!'});
    } catch(error){
      res.status(500).json({error:'Error interno'});
    }
});


export default productsRouter;
