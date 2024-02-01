DROP TABLE IF EXISTS commands;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS flashcards;
DROP TABLE IF EXISTS flashcard_categories;
DROP TABLE IF EXISTS progress;

CREATE TABLE commands (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    command TEXT NOT NULL, -- Changed column name from comand to command
    description TEXT NOT NULL
);

CREATE TABLE flashcard_categories (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    category TEXT NOT NULL
);

CREATE TABLE flashcards (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES flashcard_categories(id) ON DELETE CASCADE,
    word TEXT NOT NULL,
    definition TEXT NOT NULL,
    learned BOOLEAN
);

CREATE TABLE progress (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    barHeight BIGINT
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL
);
