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
  let sql = "SELECT item_id, product_name, price FROM products";
  con.query(sql, (err, result) => {
    if (err) throw err;

    const response =
      `<table>
            <tr>
                <th>ID</th>
                <th>Product name</th>
                <th>Price</th>
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
            "</td></tr>"
          );
        })
        .join(" ") +
      `</table>
        <h4>Buy a product</h4>
        <form action='/buy' method='get'>
            <div><input type='text' name='id' placeholder='Product id' required/></div>
            <div><input type='number' name='quantity' placeholder='Quantity' min='1' required/></div>
            <input type='submit' value='Buy'>
        </form>
      `;

    res.send(response);
  });
});

app.get("/buy", (req, res) => {
  const id = req.query.id;
  const quantity = req.query.quantity;

  let sql = "SELECT * from products WHERE item_id=" + id;

  con.query(sql, (err, result) => {
    if (err) throw err;
    if (result.length == 0) {
      res.send("Product not found");
    } else {
      const product = result[0];

      if (product.stock_quantity >= quantity) {
        const updatedQuantity = product.stock_quantity - quantity;
        sql =
          "UPDATE products SET stock_quantity=" +
          updatedQuantity +
          " WHERE item_id=" +
          id;
        con.query(sql, err => {
          if (err) throw err;
          const totalCost =  product.price * quantity;
          res.send("Total cost: $" + totalCost.toFixed(2));
        });
      } else {
        res.send("Insufficient quantity!");
      }
    }
  });
});

// The app is running on http://localhost:4000
app.listen(4000, () => console.log('The app is running on http://localhost:4000'));
