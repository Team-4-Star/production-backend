
# Solidify Production Backend

This readme details the schema used and deployment.
I understand this project is incomplete and there are issues present.

For any questions regarding the backend please contact Drew Kullman @agkullman@protonmail.com

## Schema

Once connected to database run migration.sql code,
then run seed.sql for entries.

### Users

| Parameter | Type     | Description |
| :-------- | :------- | :-----------|
| `id`      | ` SERIAL PRIMARY KEY` | Primary Key
| `username` | `VARCHAR(255) NOT NULL` | username
| `password-hash` | `VARCHAR(255) NOT NULL` | stored hashed password value
| `role` | `VARCHAR(255) NOT NULL` | Role of user; student, teacher, etc.

### Commands Table

| Parameter | Type     | Description |
| :-------- | :------- | :------------|
| `id`      | `BIG SERIAL NOT NULL PRIMARY KEY` | Primary Key
| `command` | `TEXT NOT NULL` | Command snippet text
| `description` | `TEXT NOT NULL` | Description of Command Snippet


### Flashcards Table
| Parameter | Type     | Description |
| :-------- | :------- | :------------|
| `id`      | `BIG SERIAL NOT NULL PRIMARY KEY` | Primary Key
| `category_id` | `BIGINT NOT NULL REFERENCES flashcard_categories(id) ON DELETE CASCADE,` | Foreign ID
| `word` | `TEXT NOT NULL` | Title/Question of Flashcard
| `definition` | `TEXT NOT NULL` | Answer of Flashcard
| `learned` | `BOOLEAN` | Answer of Flashcard

### Flashcard_Categories Table
| Parameter | Type     | Description |
| :-------- | :------- | :------------|
| `id`      | `BIG SERIAL NOT NULL PRIMARY KEY` | Primary Key
| `category` | `TEXT NOT NULL` | category title

### Progress Table
| Parameter | Type     | Description |
| :-------- | :------- | :------------|
| `id`      | `BIG SERIAL NOT NULL PRIMARY KEY` | Primary Key
| `barHeight` | `BIGINT` | 

## Deployment

This project is intended to be deployed statically and is strictly an API.
There is no front end for this website, hence no need for using `app.use(express.static('public'));`

It's suggested to use **Postman** to test the server once you run it.

