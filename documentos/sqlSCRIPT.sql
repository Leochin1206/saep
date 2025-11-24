CREATE DATABASE IF NOT EXISTS saep_db;
USE saep_db;

-- Tabela de Usuários
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

-- Tabela de Produtos
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    preco DECIMAL(10, 2),
    quantidade INT NOT NULL DEFAULT 0, 
    quantidade_minima INT NOT NULL DEFAULT 5 
);

-- Tabela de Movimentações 
CREATE TABLE movimentacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    produto_id INT NOT NULL,
    tipo ENUM('entrada', 'saida') NOT NULL,
    quantidade INT NOT NULL,
    data_movimentacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

-- Inserindo Usuários
INSERT INTO usuarios (nome, email, senha) VALUES
('Admin Sistema', 'admin@senai.br', '123456'),
('Gestor Estoque', 'gestor@senai.br', 'senha123'),
('Operador Logística', 'operador@senai.br', 'operador2024');

-- Inserindo Produtos
INSERT INTO produtos (nome, descricao, preco, quantidade, quantidade_minima) VALUES
('Martelo de Unha', 'Cabo de madeira tratado', 35.90, 8, 10),
('Chave de Fenda Philips', 'Ponta imantada 3mm', 12.50, 50, 15),
('Alicate Universal', 'Cabo isolado 1000V', 45.00, 20, 5),
('Serra Circular', 'Disco de 7 polegadas', 250.00, 2, 3);

-- Inserindo Movimentações
INSERT INTO movimentacoes (usuario_id, produto_id, tipo, quantidade, data_movimentacao) VALUES
(1, 1, 'entrada', 10, '2024-11-20 08:00:00'), 
(2, 2, 'entrada', 50, '2024-11-20 09:30:00'), 
(3, 1, 'saida', 2, '2024-11-21 14:00:00'),    
(3, 3, 'entrada', 20, '2024-11-22 10:00:00'); 