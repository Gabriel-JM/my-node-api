create table if not exists books (
    id int not null primary key auto_increment,
    title varchar(120) not null,
    author varchar(120) not null,
    isbn varchar(15) not null
);