// Importa a classe `MongoClient` do pacote `mongodb`, usada para se conectar ao banco de dados MongoDB
import { MongoClient } from 'mongodb';

// Exporta a função assíncrona que estabelece uma conexão com o banco de dados
export default async function conectarAoBanco(stringConexao) {
  // Declara a variável para armazenar a instância do cliente MongoDB
  let mongoClient;

  try {
      // Cria uma nova instância do `MongoClient` utilizando a string de conexão fornecida
      mongoClient = new MongoClient(stringConexao);

      // Loga uma mensagem indicando o início do processo de conexão
      console.log('Conectando ao cluster do banco de dados...');

      // Estabelece a conexão com o banco de dados
      await mongoClient.connect();

      // Loga uma mensagem indicando que a conexão foi bem-sucedida
      console.log('Conectado ao MongoDB Atlas com sucesso!');

      // Retorna a instância do cliente MongoDB para uso posterior
      return mongoClient;
  } catch (erro) {
      // Loga uma mensagem de erro se houver falha na conexão
      console.error('Falha na conexão com o banco!', erro);

      // Encerra o processo do Node.js com código de erro
      process.exit();
  }
}
