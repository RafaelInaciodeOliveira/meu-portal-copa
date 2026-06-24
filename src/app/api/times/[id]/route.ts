import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  
  try {
    const res = await fetch(`https://api.football-data.org/v4/teams/${id}`, {
      headers: {
        'X-Auth-Token': process.env.FOOTBALL_DATA_TOKEN as string,
      },
      next: { revalidate: 3600 }, // Atualiza a cada 1 hora
    });

    if (!res.ok) {
      throw new Error('Falha ao buscar time');
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro na API de times:", error);
    return NextResponse.json({ message: 'Erro ao carregar dados do time' }, { status: 500 });
  }
}