import { NextResponse } from 'next/server';

export async function GET() {
  // Puxa o seu token secreto do cofre
  const token = process.env.FOOTBALL_DATA_TOKEN;
  
  try {
    // Faz a requisição para a API oficial da Copa do Mundo (WC = World Cup)
    const response = await fetch('https://api.football-data.org/v4/competitions/WC/matches', {
      headers: {
        'X-Auth-Token': token || '',
      },
      // Truque de performance: guarda o resultado em cache por 30 segundos
      // Isso evita que você estoure o limite gratuito da API se muita gente acessar o site
      next: { revalidate: 30 } 
    });

    if (!response.ok) {
      throw new Error('Falha na comunicação com a API externa');
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar os jogos da Copa' }, { status: 500 });
  }
}