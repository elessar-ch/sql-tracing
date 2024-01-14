//controller for cart items
const knex = require('../../db/knex');

// Gets all the items currently in the current user's cart
const getUserCart = async (req, res) => {
    try {
        await knex.from('cartItem').join('product', 'cartItem.product_id', '=', 'product.id').select('cartItem.id', 'cartItem.product_id', 'cartItem.quantity', 'product.name', 'product.price').where('user_id', req.user.id).then((cartItems) => {
            res.send(cartItems)
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        await knex.from('cartItem').select('id', 'user_id', 'product_id', 'quantity').where({ 'user_id': req.user.id, 'product_id': productId }).then((cartItems) => {
            if (cartItems.length === 0) {
                knex('cartItem').insert({ 'user_id': req.user.id, 'product_id': productId, 'quantity': quantity }).then(() => {
                    res.send({ msg: 'Item added to cart!' })
                })
            } else {
                knex('cartItem').where({ 'user_id': req.user.id, 'product_id': productId }).update({ 'quantity': cartItems[0].quantity + quantity }).then(() => {
                    res.send({ msg: 'Item added to cart!' })
                })
            }
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

const removeFromCart = async (req, res) => {
    const cartItemId = parseInt(req.params.id)
    try {
        await knex.from('cartItem').select('id', 'user_id', 'product_id', 'quantity').where({ 'id': cartItemId, 'user_id': req.user.id }).then((cartItems) => {
            if (cartItems.length === 0) {
                return res.status(404).json({ msg: 'Item not found!' });
            }
            knex('cartItem').where({ 'id': cartItemId, 'user_id': req.user.id }).del().then(() => {
                res.send({ msg: 'Item removed from cart!' })
            })
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

const order = async (req, res) => {
    try {
        await knex.transaction(async (trx) => {
            const purchases = await trx('purchase').insert({ 'user_id': req.user.id, 'datetime': (new Date()).toISOString() }).returning('id')

            const cartItems = await trx.from('cartItem').select('id', 'user_id', 'product_id', 'quantity').where({ 'user_id': req.user.id })

            const purchaseItems = cartItems.map((cartItem) => {
                return { 'purchase_id': purchases[0].id, 'product_id': cartItem.product_id, 'quantity': cartItem.quantity }
            })
            await trx('purchaseItem').insert(purchaseItems)

            await trx('cartItem').where('user_id', req.user.id).del()
        })
        res.send({ msg: 'Order placed!' })
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

module.exports = {
    getUserCart,
    addToCart,
    removeFromCart,
    order,
}