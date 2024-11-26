// Importa o módulo dotenv para carregar variáveis de ambiente de um arquivo .env
import 'dotenv/config';

// Importa a classe `ObjectId` do MongoDB para manipular IDs de documentos no formato MongoDB
import { ObjectId } from "mongodb";

// Importa a função para conectar ao banco de dados a partir do arquivo de configuração
import conectarAoBanco from "../config/dbConfig.js";

// Estabelece a conexão com o banco de dados utilizando a string de conexão fornecida em uma variável de ambiente
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

// Função assíncrona para recuperar todos os posts do banco de dados
export async function getTodosPosts() {
    // Seleciona o banco de dados "imersao-instaarcane"
    const db = conexao.db("imersao-instaarcane");
    // Seleciona a coleção "posts" dentro do banco de dados
    const colecao = db.collection("posts");
    // Realiza uma consulta para obter todos os documentos na coleção e os retorna como um array
    return colecao.find().toArray();
}

// Função assíncrona para criar um novo post
export async function criarPost(novoPost) {
    // Seleciona o banco de dados "imersao-instaarcane"
    const db = conexao.db("imersao-instaarcane");
    // Seleciona a coleção "posts" dentro do banco de dados
    const colecao = db.collection("posts");
    // Insere um novo documento na coleção e retorna o resultado da operação
    return colecao.insertOne(novoPost);
}

// Função assíncrona para atualizar um post existente com base em seu ID
export async function atualizarPost(id, novoPost) {
    // Seleciona o banco de dados "imersao-instaarcane"
    const db = conexao.db("imersao-instaarcane");
    // Seleciona a coleção "posts" dentro do banco de dados
    const colecao = db.collection("posts");
    // Converte o ID fornecido (string) para um objeto ObjectId do MongoDB
    const objID = ObjectId.createFromHexString(id);
    // Atualiza o documento correspondente ao ID na coleção, configurando os novos dados
    return colecao.updateOne(
        { _id: new ObjectId(objID) }, // Critério de seleção: documento com o ID especificado
        { $set: novoPost }           // Define os novos valores para o documento
    );
}
