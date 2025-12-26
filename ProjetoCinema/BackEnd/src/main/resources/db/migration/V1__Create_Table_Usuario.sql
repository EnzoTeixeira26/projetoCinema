CREATE TABLE IF NOT EXISTS usuario (
  id serial PRIMARY KEY,
  nome VARCHAR(80) NOT NULL,
  telefone VARCHAR(11) NOT NULL,
  email VARCHAR(30) NOT NULL,
  data_nascimento DATE,
  senha VARCHAR(60) NOT NULL
);  