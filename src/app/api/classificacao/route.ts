import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.FOOTBALL_DATA_TOKEN;
  
  try {
    // Busca a tabela de classificação (standings) da Copa do Mundo (WC)
    const response = await fetch('https://api.football-data.org/v4/competitions/WC/standings', {
      headers: {
        'X-Auth-Token': token || '',
      },
      // Cache de 1 hora, já que a tabela só muda quando um jogo acaba
      next: { revalidate: 3600 } 
    });

    if (!response.ok) throw new Error('Falha na comunicação com a API');

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar classificação' }, { status: 500 });
  }
}