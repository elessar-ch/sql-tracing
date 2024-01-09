const knex = require('../../db/knex');

// Gets all addresses
const getAddressesAuth = async (req, res) => {
    try {

        const user = await knex.select().from('users').where('id', req.user.id).then((user) => { return user[0] })

        if (user.id === req.user.id) {
            await knex.from('address').select('street', 'suburb', 'city', 'code').then((addresses) => {
                res.send(addresses)
            })
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

// Updates address by ID
const updateAddress = async (req, res) => {
    try {
        const {
            street,
            suburb,
            city,
            code,
        } = req.body;

        const address = {};

        if (street) address.street = street;
        if (suburb) address.suburb = suburb;
        if (city) address.city = city;
        if (code) address.code = code;
        address.updated_at = new Date(),

            await knex('address').where('id', req.params.id)
                .update(address).then(() => {
                    knex.select()
                        .from('address').where('id', req.params.id).then((address) => {
                            res.send(address[0])
                        })
                })

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

// Remove address by ID
const removeAddress = async (req, res) => {
    try {
        let exists = await knex.select().from('address').where('id', req.params.id).then((address) => { return address[0] });
        if (!exists) {
            return res.status(400).json({ msg: 'Address not found!' });
        }

        if (exists.id === req.params.id) {
            knex('address').where('id', req.params.id)
                .del().then(function () {
                    res.json({ msg: 'Address deleted' });
                })
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

module.exports = {
    getAddressesAuth,
    updateAddress,
    removeAddress
}