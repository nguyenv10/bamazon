const mysql = require("mysql");
const express = require("express");
const app = express();

// Change the user and password with your mysql credentials
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mysql",
  database: "bamazon"
});

con.connect(err => {
  if (err) throw err;
  console.log("Connected to database!");
});

app.get("/", (req, res) => {
  const menu = `
        <h2>Bamazon Menu</h2>
        <a href='/products'><button>View Products for Sale</button></a>
        <a href='/low-inventory'><button>View Low Inventory</button></a>
        <a href='/add-inventory'><button>Add to Inventory</button></a>
        <a href='/add-product'><button>Add New Product</button></a>
    `;

  res.send(menu);
});

app.get("/products", (req, res) => {
  let sql = "SELECT * FROM products";
  con.query(sql, (err, result) => {
    if (err) throw err;

    if (result.length === 0) {
      res.send("<h2>Nothing found.</h2>");
    } else {
      const response =
        `<h2>Products for Sale</h2>
      <table>
              <tr>
                  <th>ID</th>
                  <th>Product name</th>
                  <th>Price</th>
                  <th>Quantity</th>
              </tr>` +
        result
          .map(product => {
            return (
              "<tr><td>" +
              product.item_id +
              "</td><td>" +
              product.product_name +
              "</td><td>" +
              product.price +
              "</td><td>" +
              product.stock_quantity +
              "</td></tr>"
            );
          })
          .join(" ") +
        `</table>
      <a href='/'><button>Go back to the main menu</button></a>`;

      res.send(response);
    }
  });
});

app.get("/low-inventory", (req, res) => {
  let sql = "SELECT * FROM products WHERE stock_quantity < 5";
  con.query(sql, (err, result) => {
    if (err) throw err;

    if (result.length === 0) {
      res.send(
        "<h2>Nothing found.</h2><a href='/'><button>Go back to the main menu</button></a>"
      );
    } else {
      const response =
        `<h2>Low Inventory</h2>
        <table>
                <tr>
                    <th>ID</th>
                    <th>Product name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                </tr>` +
        result
          .map(product => {
            return (
              "<tr><td>" +
              product.item_id +
              "</td><td>" +
              product.product_name +
              "</td><td>" +
              product.price +
              "</td><td>" +
              product.stock_quantity +
              "</td></tr>"
            );
          })
          .join(" ") +
        `</table>
        <a href='/'><button>Go back to the main menu</button></a>`;

      res.send(response);
    }
  });
});

app.get("/add-inventory", (req, res) => {
  const form = `
        <h2>Add inventory to product</h2>
        <form action='/inventory-added' method='get'>
        <div><input type='text' name='id' placeholder='Product ID' required/></div>
        <div><input type='number' name='quantity' placeholder='Quantity' min='1' required/></div>
        <input type='submit' value='Add to inventory'>
        </form>
    `;

  res.send(form);
});

app.get("/inventory-added", (req, res) => {
  const id = req.query.id;
  const quantity = req.query.quantity;
  let sql =
    "UPDATE products SET stock_quantity= stock_quantity + " +
    quantity +
    " WHERE item_id=" +
    id;
  con.query(sql, err => {
    if (err) throw err;

    res.send("<h4>Inventory added successfully!</h4>");
  });
});

app.get("/add-product", (req, res) => {
  const form = `
        <form action='product-added' method='get'>
            <input type='text' name='id' placeholder='Product ID' required/>
            <input type='text' name='name' placeholder='Product Name' required/>
            <input type='text' name='department' placeholder='Department' required/>
            <input type='number' step='.01' min='0.01' name='price' placeholder='Price' required/>
            <input type='number' name='quantity' min='0' placeholder='Stock quantity' required/>
            <input type='submit' value='Add Product'>    
    `;

  res.send(form);
});

app.get("/product-added", (req, res) => {
  let { id, name, price, department, quantity } = req.query;

  let sql = `INSERT INTO products(item_id, product_name, department_name, price, stock_quantity) VALUES('${id}', '${name}', '${department}', '${price}', '${quantity}');`;
  con.query(sql, err => {
    if (err) throw err;
    res.send("<h4>Product added successfully!</h4><a href='/'><button>Go back to the main menu</button></a>");
  });
});

// The app is running on http://localhost:4500
app.listen(4500, () =>
  console.log("The app is running on http://localhost:4500")
);
