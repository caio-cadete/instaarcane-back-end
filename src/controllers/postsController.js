// Importa as funções do modelo de dados para interagir com o banco de dados
import { getTodosPosts, criarPost, atualizarPost } from "../models/postsModel.js";

// Importa o módulo `fs` (File System) para manipular arquivos no sistema operacional
import fs from "fs";

// Importa a função para gerar descrições utilizando o serviço Gemini
import gerarDescricaoComGemini from "../services/geminiService.js";

// Função para listar todos os posts
export async function listarPosts(req, res) {
    // Recupera os posts do banco de dados utilizando a função `getTodosPosts`
    const posts = await getTodosPosts();
    // Responde à requisição com o status 200 (OK) e os dados dos posts em formato JSON
    res.status(200).json(posts);
}

// Função para criar um novo post
export async function postarNovoPost(req, res) {
    // Obtém o conteúdo do corpo da requisição (dados do novo post)
    const novoPost = req.body;
    try {
        // Insere o novo post no banco de dados
        const postCriado = await criarPost(novoPost);
        // Responde com status 200 e o post recém-criado
        res.status(200).json(postCriado);
    } catch (erro) {
        // Em caso de erro, loga a mensagem e retorna uma resposta de erro com status 500 (Erro interno do servidor)
        console.error(erro.message);
        res.status(500).json({ "Erro": "Falha na requisição" });
    }
}

// Função para fazer upload de uma imagem e criar um post associado
export async function uploadImagem(req, res) {
    // Cria um objeto inicial do post com campos padrão
    const novoPost = {
        descricao: "",               // Inicialmente sem descrição
        imgUrl: req.file.originalname, // Usa o nome original do arquivo enviado
        alt: ""                      // Alt-text vazio inicialmente
    };

    try {
        // Cria o post no banco de dados
        const postCriado = await criarPost(novoPost);

        // Atualiza o caminho da imagem para incluir o ID do post recém-criado
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;

        // Renomeia o arquivo enviado para o novo caminho com o ID
        fs.renameSync(req.file.path, imagemAtualizada);

        // Responde com status 200 e os dados do post criado
        res.status(200).json(postCriado);
    } catch (erro) {
        // Em caso de erro, loga a mensagem e retorna uma resposta de erro com status 500
        console.error(erro.message);
        res.status(500).json({ "Erro": "Falha na requisição" });
    }
}

// Função para atualizar um post com descrição gerada automaticamente
export async function atualizarNovoPost(req, res) {
    // Obtém o ID do post a partir dos parâmetros da requisição
    const id = req.params.id;

    // Cria a URL da imagem baseada no ID
    const urlImagem = `http://localhost:3000/${id}.png`;

    try {
        // Lê a imagem correspondente do diretório de uploads
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`);

        // Gera uma descrição para a imagem usando o serviço Gemini
        const descricao = await gerarDescricaoComGemini(imgBuffer);

        // Cria o objeto com os novos dados do post
        const post = { 
            imgUrl: urlImagem,       // URL da imagem
            descricao: descricao,    // Descrição gerada automaticamente
            alt: req.body.alt        // Alt-text enviado no corpo da requisição
        };

        // Atualiza o post no banco de dados
        const postCriado = await atualizarPost(id, post);

        // Responde com status 200 e os dados do post atualizado
        res.status(200).json(postCriado);
    } catch (erro) {
        // Em caso de erro, loga a mensagem e retorna uma resposta de erro com status 500
        console.error(erro.message);
        res.status(500).json({ "Erro": "Falha na requisição" });
    }
}
