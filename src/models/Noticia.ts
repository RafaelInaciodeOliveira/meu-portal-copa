import mongoose, { Schema, model, models } from 'mongoose';

const NoticiaSchema = new Schema({
  titulo: {
    type: String,
    required: [true, 'O título é obrigatório'],
    trim: true,
  },
  subtitulo: {
    type: String,
    required: [true, 'O subtítulo é obrigatório'],
    trim: true,
  },
  conteudo: {
    type: String,
    required: [true, 'O conteúdo da notícia é obrigatório'],
  },
  imagemUrl: {
    type: String,
    required: false, // A imagem é opcional
  },
  dataCriacao: {
    type: Date,
    default: Date.now,
  }
});

// Impede que o Next.js recompile o modelo e gere erros
const Noticia = models.Noticia || model('Noticia', NoticiaSchema);

export default Noticia;