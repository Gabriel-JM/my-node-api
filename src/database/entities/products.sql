create table if not exists products (
    id int not null primary key auto_increment,
    name varchar(120) not null,
    brand varchar(60) not null,
    price numeric(11,2) not null,
    weight numeric(7,2) not null,
    product_category_id int not null,
    foreign key(product_category_id) references products_categories(id)
);