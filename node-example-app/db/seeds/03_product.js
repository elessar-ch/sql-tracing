exports.seed = function (knex) {
  // Inserts example seed entries for product table
  return knex('product').insert([
    {
      id: 1,
      name: "FUJOMOTO",
      description: "Coffee table, black-brown",
      price: 9.99,
      image: "https://images.example.com/FUJOMOTO.jpg",
      stock: 10,
    },
    {
      id: 2,
      name: "FJÄLLERÖN",
      description: "Armchair, outdoor, white",
      price: 19.99,
      image: "https://images.example.com/.jpg",
      stock: 15,
    },
    {
      id: 3,
      name: "SOLLBERGET",
      description: "Conference chair, black/silver-colour",
      price: 29.99,
      image: "https://images.example.com/FJÄLLBERGET.jpg",
      stock: 20,
    },
    {
      id: 4,
      name: "BONOLAMPI",
      description: "Table lamp, white",
      price: 39.99,
      image: "https://images.example.com/BONOLAMPI.jpg",
      stock: 25,
    },
  ]);
};