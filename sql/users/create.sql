CREATE TABLE users(
    uid serial not null primary key,
    name varchar(40) not null,
    secret varchar(256) --hashed password
)