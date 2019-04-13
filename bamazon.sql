create database bamazon; 

use bamazon;

create table products (
	item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(50) NOT NULL,
	department_name VARCHAR(50) NOT NULL,
	price DECIMAL(6,2) NOT NULL,
	stock_quantity INTEGER(11) NOT NULL,
	PRIMARY KEY (item_id)
);

insert into products (item_id, product_name, department_name, price, stock_quantity)
values (1,'Meditations','Books',10.89,10),
(2,'Titanic','Movies',15.22,99),
(3,'Headphones','Electronics',24.89,128),
(4,'Blur','Video Games',21.99,87),
(5,'To Kill a Mockingbird','Books',11.42,61),
(6,'The Art of War','Books',8.78,15),
(7,'Shirt','Clothing',24.89,150),
(8,'Cool Watch','Watches',100.90,7),
(9,'Linkin Park Album','Music',28.78,35),
(10,'The Legend of Zelda','Video Games',48.89,168),
(11,'Cocacola','Drinks',5.85,100);
