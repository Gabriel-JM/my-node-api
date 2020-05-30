# My Typescript Node API
Its a back-end server made in Node.js with Typescript and MySQL as Database. The idea was pass my Node Vanilla JS server to a Typescript version, with less dependencies as i could.

## How to use?

### Start server
```
npm i
npm start
```
1. Type `npm i` on terminal for download all `typescript` and `mysql2` packages, but just once.
2. And then type `npm start` on terminal to start the server.

### Paths

- `/products-categories`: path for Products Categories.
- `/products`: path for products(funcional but in development).

### Creating your paths

1. The path creation is automatic.
2. All paths code must be in `app/src` folder, must have a folder with the name of the path and a file to be the Controller Class.
3. The name of the folder will be the path, for example:
    - Folder `Item` has path `/item`.
    - Folder `ItemCategory` has path `/item-category`.
4. The path's controller file must have the folder name on it, for example:
    - Folder `Item` has controller `ItemController.ts`.
    - Folder `ItemCategory` has controller `ItemCategoryController.ts`.

## Config
- You'll need a database in MySQL named `my_ts_node_db` for start the server.
- By default the server listen on `3200` port, but you can change on `index.ts`.