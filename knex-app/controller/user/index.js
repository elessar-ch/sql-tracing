const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const knex = require('../../db/knex');

// Reusable function (Gets address with street number/name and area code)
const getAddress = async (street, code) => {
    return await knex.select().from('addresses').where('street', street).where('code', code).then((address) => { return address[0] })
}

// Reusable function (Gets user by email, checks if email is database)
const getUser = async (email) => {
    return await knex.select().from('user').where('email', email).then((user) => { return user[0] })
}

// Add new user to users table. Route: [api/users/register]
// NOTE: Upon registration we'll first create address if it's not in our database already (Avoid duplicates)
const addUser = async (req, res) => {
    try {
        let {
            street,
            suburb,
            city,
            code,
            name,
            surname,
            email,
            gender,
            DOB,
            contact_number,
            role,
            password
        } = req.body;

        const addressExists = await getAddress(street, code); // Checks if address is in our database

        if (!addressExists) { // If address isn't found  new address gets inserted into addressess table

            let newAddress = {
                street,
                suburb,
                city,
                code
            }


            await knex('addresses').insert(newAddress); // Inserts address

            let emailExists = await getUser(email); // Checks if user exists by email(Unique)

            const latest = await getAddress(street, code); // Gets address by street and code field so that we can attach address_id to user

            if (!emailExists) { // If user isn't found new user gets inserted into users table
                let newUser = {
                    name,
                    surname,
                    email,
                    gender,
                    DOB,
                    contact_number,
                    role,
                    password,
                    address_id: latest.id
                }

                const salt = await bcrypt.genSalt(10);

                newUser.password = await bcrypt.hash(password, salt); // Hashes our password for security

                await knex('user').insert(newUser); // Inserts new user

                res.send({ msg: "User successfully registered!" })
            } else {
                res.send({ msg: "User email already registered!" }) // Condition if user is already in the database
            }

        } else {
            // Condition if address is already in the database
            let emailExists = await getUser(email); // Checks if user exists

            const latest = await getAddress(street, code); // Gets Address users trying to link to user data

            if (!emailExists) {
                let newUser = {
                    name,
                    surname,
                    email,
                    gender,
                    DOB,
                    contact_number,
                    role,
                    password,
                    address_id: latest.id
                }
                await knex('user').insert(newUser) // Inserts users
                res.send({ msg: "Address already stored!, User successfully registered!" })
            } else {
                // Condition if address and user is already in the database
                res.send({ msg: "User email & address already registered!" })
            }
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

// Logins in user and return id and access token. Route: [api/users/login]
const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        let user = await knex.select().from('user').where('email', email).then((user) => { return user[0] }) // Checks for user in the database

        if (!user) {
            // Condition if user not found
            return res.status(400).json({ msg: 'Email not found!' });
        }

        const isMatch = await bcrypt.compare(password, user.password); // Hashes password and compares it to password in users data

        if (!isMatch) {
            // Condition if password isn't correct
            return res.status(400).json({ msg: "Invalid Credentials" });
        }

        const payload = { // This is what will be returned if have correct token (User id get's returned so that we can search user within our database)
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            config.get("jwtSecret"), // Gets secret in default.json (config handles the functionality to fetch secret)
            {
                expiresIn: '2d', // 2 days
            },
            (err, token) => {
                if (err) throw err;
                res.json({ id: user.id, token }); // Returna user's ID and access token
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

/** WON'T RE EXPLAIN ABOVE FUNCTIONALITY GOING FORWARD **/

// Get's all users data that's public for any logged in users. Route: [api/users]
const getUsersAuth = async (req, res) => {
    try {

        const user = await knex.select().from('user').where('id', req.user.id).then((user) => { return user[0] })

        if (user.id === req.user.id) {
            await knex.from('user').select('name', 'surname').then((users) => {
                res.send(users)
            })
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

// Gets all user data even private fields (id, address_id, gender, DOB, password hash and role). Route: [api/users/admin]
const getUsersAdmin = async (req, res) => {
    try {
        const user = await knex.select().from('user').where('id', req.user.id).then((user) => { return user[0] })

        if (user.role === 'admin') { // Checks if user is an admin (Needs to be admin)
            await knex.select().from('user').then((users) => {
                res.send(users)
            })
        } else {
            res.status(401);
            return res.send("Access Rejected, Not Authorized");
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

// Get's logged in users data. Route: [api/users/whoami]
const getUserData = async (req, res) => {
    try {

        const user = await knex
            .from('user')
            .select('id', 'name', 'surname', 'gender', 'email', 'DOB', 'contact_number', 'address_id', 'role') // Returns only theses fields
            .where('id', req.user.id)
            .then((user) => { return user[0] })

        if (user.id === req.user.id) {
            res.send(user);
        } else {
            res.status(401);
            return res.send("Access Rejected, Not Authorized");
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

// Updates user data by id. Route: [api/users/:id]
const updateUser = async (req, res) => {
    try {

        const user = await knex.select().from('user').where('id', req.user.id).then((user) => { return user[0] })

        if (user.id === req.user.id) {
            const {
                name,
                surname,
                password,
                contact_number
            } = req.body;

            /** Constructing object to insert **/
            const user = {}
            if (name) user.name = name; // If name was included in req.body, it will overwrite name to be req.body.name value (Applies to all)
            if (surname) user.surname = surname;
            if (password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);
            };
            if (contact_number) user.contact_number = contact_number;
            await knex('user').where('id', req.user.id)
                .update(user).then(() => { // Updates user by ID (req.user.id auth user)
                    knex.select('name', 'surname', 'contact_number', 'gender', 'DOB').from('user').where('id', req.user.id).then((user) => {
                        res.send(user[0])
                    })
                })
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

// Deletes user data by id. Route: [api/users/:id]
const removeUser = async (req, res) => {
    try {
        const user = await knex.select().from('user').where('id', req.user.id).then((user) => { return user[0] })

        if (user.id === req.user.id) {
            knex('user').where('id', req.user.id)
                .del().then(function () { // Deletes user by ID (req.user.id auth user)
                    res.json({ msg: 'User removed!' });
                })
        } else {
            res.status(401);
            return res.send("Access Rejected, Not Authorized");
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

module.exports = {
    addUser,
    login,
    getUsersAuth,
    getUser,
    getUsersAdmin,
    getUserData,
    updateUser,
    removeUser
}