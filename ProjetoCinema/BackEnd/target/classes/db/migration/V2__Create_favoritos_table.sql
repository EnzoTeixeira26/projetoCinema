CREATE TABLE IF NOT EXISTS favoritos (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    conteudo_id BIGINT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('FILME', 'SERIE', 'ANIME')),
    imagem_url TEXT,
    categoria VARCHAR(100),
    sinopse TEXT,
    data_adicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)