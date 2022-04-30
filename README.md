# LikeDB (likeDB.js)

LikeDB is an open source JavaScript class that brings database features like CRUD operations,and more capabilities.

## Instantiating a database

```js
let db = new likeDB("testDataBase");

try {
    db.createDB();
} catch (e) {
    console.log(e);
}
```


## Drop existing database

```js
try {
    db.dropDB();
} catch (e) {
    console.log(e);
}
```


## Create a new table

```js
try {
    db.createTable("Table1");
} catch (e) {
    console.log(e);
}
```


## Drop existing table

```js
try {
    db.dropTable("Table1");
} catch (e) {
    console.log(e);
}
```


## Create a new field

```js
try {
    db.createField("Table1", "username", String, false, false, false);
} catch (e) {
    console.log(e);
}
```


## Drop existing field

```js
try {
    db.dropField("Table1", "username");
} catch (e) {
    console.log(e);
}
```


## Adds a record to a table

```js
try {
    db.insert("Table1", {"username":"user1"});
} catch (e) {
    console.log(e);
}
```


## Retrieve data from table

```js
try {
    db.select("Table1", ["username"]);
} catch (e) {
    console.log(e);
}
```


## Update existing record(s)

```js
try {
    db.update("Table1", {"username":"user1"},{"username":"user2"});
} catch (e) {
    console.log(e);
}
```


## Delete existing record(s)

```js
try {
    db.delete("Table1", {'username': "user2"});
} catch (e) {
    console.log(e);
}
```


## Software License Agreement (MIT)
Copyright (c) Hassani Mohammed El Habib
