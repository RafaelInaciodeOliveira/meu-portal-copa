import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Noticia from '@/models/Noticia';

// Rota para BUSCAR todas as notícias (Pública)
export async function GET() {
  try {
    await connectToDatabase();
    
    // Busca todas as notícias e ordena da mais recente para a mais antiga
    const noticias = await Noticia.find({}).sort({ dataCriacao: -1 });
    
    return NextResponse.json({ noticias }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao buscar notícias' }, { status: 500 });
  }
}

// Rota para CRIAR uma nova notícia (Será usada no teu painel Admin)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { titulo, subtitulo, conteudo, imagemUrl } = body;

    // Validação básica
    if (!titulo || !subtitulo || !conteudo) {
      return NextResponse.json({ message: 'Preenche os campos obrigatórios' }, { status: 400 });
    }

    await connectToDatabase();

    const novaNoticia = await Noticia.create({
      titulo,
      subtitulo,
      conteudo,
      imagemUrl
    });

    return NextResponse.json({ message: 'Notícia criada com sucesso!', noticia: novaNoticia }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao criar a notícia' }, { status: 500 });
  }
}