import { NextResponse } from 'next/server';

export async function GET(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const res = await fetch(`https://api.football-data.org/v4/matches/${id}`, {
      headers: {
        'X-Auth-Token': process.env.FOOTBALL_DATA_TOKEN as string,
      },
      next: { revalidate: 60 }, // Atualiza a cada 1 minuto
    });

    if (!res.ok) {
      throw new Error('Falha ao buscar detalhes da partida');
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro na API de detalhes da partida:", error);
    return NextResponse.json({ message: 'Erro ao carregar partida' }, { status: 500 });
  }
}