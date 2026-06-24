import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.FOOTBALL_DATA_TOKEN;
  
  try {
    // Busca os artilheiros da Copa (limite de 10 jogadores para não pesar a tela)
    const response = await fetch('https://api.football-data.org/v4/competitions/WC/scorers?limit=100', {
      headers: {
        'X-Auth-Token': token || '',
      },
      // Cache de 1 hora (3600 seg) porque artilharia não muda a cada minuto
      next: { revalidate: 3600 } 
    });

    if (!response.ok) throw new Error('Falha na comunicação com a API');

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar artilheiros' }, { status: 500 });
  }
}