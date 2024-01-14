//controller file for purchases
const knex = require('../../db/knex');

// Gets all purchases for the user
const getUserPurchases = async (req, res) => {
    try {
        await knex.from('purchase').select('id', 'datetime').where('user_id', req.user.id).then((purchases) => {
            res.send(purchases)
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

// Gets a specific purchase for the user
const getPurchase = async (req, res) => {
    console.log(req.user.id)
    const purchaseId = parseInt(req.params.id)
    try {
        await knex.from('purchase').select('id', 'user_id', 'datetime').where({ 'id': purchaseId, 'user_id': req.user.id }).then((purchases) => {
            if (purchases.length === 0) {
                return res.status(404).json({ msg: 'Purchase not found!' });
            }
            res.send(purchases[0])
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

// Gets a specific purchase for the user including the list of purchased items
const getPurchasedItems = async (req, res) => {
    const purchaseId = parseInt(req.params.id)
    try {
        await knex.from('purchaseItem').join('product', 'purchaseItem.product_id', '=', 'product.id').select('purchaseItem.id', 'purchaseItem.purchase_id', 'purchaseItem.product_id', 'purchaseItem.quantity', 'product.name', 'product.price').where('purchase_id', purchaseId).then((purchasedItems) => {
            res.send(purchasedItems)
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

module.exports = {
    getUserPurchases,
    getPurchase,
    getPurchasedItems,
}