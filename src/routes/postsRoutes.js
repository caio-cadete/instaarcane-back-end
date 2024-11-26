// Importa o framework Express para criar a aplicação web
import express from "express";

// Importa o Multer para lidar com uploads de arquivos
import multer from "multer";

// Importa o CORS (Cross-Origin Resource Sharing) para permitir requisições entre origens diferentes
import cors from "cors";

// Importa as funções controladoras para manipular a lógica dos posts
import {
  listarPosts,
  postarNovoPost,
  uploadImagem,
  atualizarNovoPost
} from "../controllers/postsController.js";

// Configura as opções de CORS para especificar a origem permitida e o status de sucesso
const corsOptions = { 
  origin: "http://localhost:8000", // Define a origem permitida (frontend, por exemplo)
  optionsSuccessStatus: 200       // Status HTTP usado para requisições bem-sucedidas de pré-verificação
};

// Configura o armazenamento de arquivos com Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define o diretório onde os arquivos enviados serão armazenados
    cb(null, 'uploads/'); // Substitua por um caminho apropriado para seu ambiente
  },
  filename: function (req, file, cb) {
    // Define o nome do arquivo armazenado; neste caso, mantém o nome original
    cb(null, file.originalname); // Para produção, considere adicionar nomes únicos para evitar conflitos
  }
});

// Cria uma instância do middleware Multer para lidar com uploads
const upload = multer({ storage: storage });

// Linux ou Mac: Alternativamente, pode-se usar um destino direto sem configuração de armazenamento
// const upload = multer({ dest: ".uploads" })

// Define as rotas usando o objeto Express `app`
const routes = (app) => {
  // Permite que o servidor processe corpos de requisição no formato JSON
  app.use(express.json());

  // Habilita CORS usando as opções configuradas
  app.use(cors(corsOptions));

  // Rota para recuperar a lista de todos os posts
  app.get("/posts", listarPosts); // A função controladora `listarPosts` será executada para essa rota

  // Rota para criar um novo post
  app.post("/posts", postarNovoPost); // Chama a função `postarNovoPost` para lidar com a lógica de criação

  // Rota para upload de imagens (espera uma única imagem com o campo "imagem" no formulário)
  app.post("/upload", upload.single("imagem"), uploadImagem); // A função `uploadImagem` processa a imagem enviada

  // Rota para atualizar um post específico (identificado pelo parâmetro `id`)
  app.put("/upload/:id", atualizarNovoPost); // Chama `atualizarNovoPost` para atualizar os dados do post
};

// Exporta as rotas para serem usadas no servidor principal
export default routes;
