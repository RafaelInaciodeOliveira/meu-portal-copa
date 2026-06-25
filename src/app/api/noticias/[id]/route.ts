import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Noticia from '@/models/Noticia';

// Rota para ATUALIZAR uma notícia específica
export async function PUT(
  request: Request,
  { params }: { params: { id: string } | any }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();
    
    await connectToDatabase();
    
    const noticiaAtualizada = await Noticia.findByIdAndUpdate(id, body, { new: true });
    
    if (!noticiaAtualizada) {
      return NextResponse.json({ message: 'Notícia não encontrada' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Notícia atualizada com sucesso!', noticia: noticiaAtualizada }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao atualizar a notícia' }, { status: 500 });
  }
}

// Rota para EXCLUIR uma notícia específica
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } | any }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    await connectToDatabase();
    
    const noticiaDeletada = await Noticia.findByIdAndDelete(id);
    
    if (!noticiaDeletada) {
      return NextResponse.json({ message: 'Notícia não encontrada' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Notícia excluída com sucesso!' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao excluir a notícia' }, { status: 500 });
  }
}