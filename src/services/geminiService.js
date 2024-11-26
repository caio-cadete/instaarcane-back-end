// Importa a biblioteca do Google Generative AI para trabalhar com modelos generativos
import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicializa o cliente da API usando a chave de API fornecida nas variáveis de ambiente
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Obtém o modelo generativo específico, neste caso, o "gemini-1.5-flash"
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Exporta uma função assíncrona para gerar uma descrição utilizando o modelo Gemini
export default async function gerarDescricaoComGemini(imageBuffer) {
  // Define o prompt para o modelo generativo. Especifica o tipo de descrição desejada.
  const prompt =
    "Gere uma descrição em Português do Brasil para os personagens...";

  try {
    // Prepara os dados da imagem em um formato compatível para envio ao modelo
    const image = {
      inlineData: {
        data: imageBuffer.toString("base64"), // Converte o buffer da imagem para base64
        mimeType: "image/png", // Define o tipo MIME da imagem (neste caso, PNG)
      },
    };

    // Chama o método do modelo para gerar conteúdo com base no prompt e na imagem
    const res = await model.generateContent([prompt, image]);

    // Retorna a resposta gerada pelo modelo ou uma mensagem padrão caso a resposta esteja ausente
    return res.response.text() || "Alt-text não disponível.";
  } catch (erro) {
    // Captura e exibe erros no console para depuração
    console.error("Erro ao obter alt-text:", erro.message, erro);

    // Lança um erro com uma mensagem personalizada
    throw new Error("Erro ao obter o alt-text do Gemini.");
  }
}
