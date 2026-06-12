import { Product } from "../models/ProductModel.js";

const getProducts = async (req, res) => {
  try {
    const userLogged = req.userLogged
    const filterProducts = await Product.find({ userId: userLogged.id }, { userId: 0 })
    res.json({
      success: true,
      data: filterProducts,
      message: "Products fetched successfully"
    })
  } catch (error) {
    res.status(500).json({ success: false, error: "Error fetching products" })
  }
}

const getProduct = async (req, res) => {
  try {
    const id = req.params.id
    const foundProduct = await Product.findById(id, { userId: 0 })
    if (!foundProduct) res.status(404).json({ error: "Not found" })
    res.json(foundProduct)
  } catch (error) {
    res.status(400).json({ error: "Invalid ID format" })
  }
}

const createProduct = async (req, res) => {
  try {
    const body = req.body
    const userLogged = req.userLogged

    const newProduct = await Product.create({
      name: body.name,
      price: body.price,
      category: body.category,
      stock: body.stock,
      available: body.stock > 0,
      userId: userLogged.id
    })

    newProduct.save()

    // destructuring para eliminar el userId del objeto producto y quedarnos con el resto de la data
    const { userId, ...publicDataProduct } = newProduct.toObject()

    res.json({
      success: true,
      data: publicDataProduct,
      message: "Product created successfully"
    })
  } catch (error) {
    res.status(500).json({ success: false, error: "Error creating product" })
  }
}

const updateProduct = async (req, res) => {
  try {
    const id = req.params.id
    const body = req.body
    const userLogged = req.userLogged

    const product = await Product.findById(id)

    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" })
    }

    if (product.userId.toString() !== userLogged.id) {
      return res.status(403).json({ success: false, error: "Forbidden: this product does not belong to you" })
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, { ...body, available: body.stock > 0 }, { new: true, projection: { userId: 0 } })

    res.json({
      success: true,
      data: updatedProduct,
      message: "Product updated successfully"
    })
  } catch (error) {
    res.status(400).json({ success: false, error: "Invalid ID format" })
  }
}

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params
    const userLogged = req.userLogged

    const product = await Product.findById(id)

    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" })
    }

    if (product.userId.toString() !== userLogged.id) {
      return res.status(403).json({ success: false, error: "Forbidden: this product does not belong to you" })
    }

    await Product.findByIdAndDelete(id)

    const { userId, ...publicDataProduct } = product.toObject()

    res.json({ success: true, data: publicDataProduct, message: "Product deleted successfully" })
  } catch (error) {
    res.status(400).json({ success: false, error: "Invalid ID format" })
  }
}

export { getProducts, getProduct, createProduct, updateProduct, deleteProduct }
