import express from 'express';
import CartManager from '../dao/CartManager';

const cartsRouter = express.Router();
const CM = new CartManager();

// POST: Crea un nuevo carrito
cartsRouter.post('/', async (req, res) => {

   const cart = await CM.newCart();
  
   if (cart) {
    res.send({status:"ok", message:"El Carrito se creó correctamente!", id:cart._id});
   } else {
    res.status(500).send({status:"error", message:"Error! No se pudo crear el Carrito!"});
    }
});

// GET Obtiene productos de un carrito por su id (cid)
cartsRouter.get('/:cid', async  (req, res) => {
  try{ const cid = req.params.cid;
  const cart = await CM.getCart(cid);
    res.send({products:cart.products})
  }catch(error){
    res.status(400).send({message:"Error! Id no encontrado"})
  }
  
});

// POST Agregar producto a un carrito por su id (cid) y el id del producto (pid)
cartsRouter.post('/:cid/product/:pid', async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  try {
    
    let cartData = await CM.addProductToCart(cid, pid);
      res.send({message:"Producto agregado"})
    
    } catch (error) {

       res.status(500).send({ message:"Error!: " + error });
     }
 });

 cartsRouter.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;
    const result = await CM.updateQuantity(cid, pid, quantity);

    if (result) {
        res.send({status:"ok", message:"El producto se actualizó correctamente!"});
    } else {
        res.status(400).send({status:"error", message:"Error! No se pudo actualizar el Producto del Carrito!"});
    }
  } catch (error) {
    res.status(500).send({status:"error", message:"Error interno del servidor"});
  }
});

cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const result = await CM.deleteProduct(cid, pid);

    if (result) {
        res.send({status:"ok", message:"El producto se eliminó correctamente!"});
    } else {
        res.status(400).send({status:"error", message:"Error! No se pudo eliminar el Producto del Carrito!"});
    }
  } catch (error) {
    res.status(500).send({status:"error", message:"Error interno del servidor"});
  }
});

cartsRouter.delete("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const result = await CM.deleteProducts(cid);

    if (result) {
        res.send({status:"ok", message:"El carrito se vació correctamente!"});
    } else {
        res.status(400).send({status:"error", message:"Error! No se pudo vaciar el Carrito!"});
    }
  } catch (error) {
    res.status(500).send({status:"error", message:"Error interno del servidor"});
  }
});


export default cartsRouter;
