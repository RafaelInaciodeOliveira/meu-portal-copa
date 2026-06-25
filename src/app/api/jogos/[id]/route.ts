import { NextResponse } from 'next/server';

export async function GET(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const res = await fetch(`https://api.football-data.org/v4/matches/${id}`, {
      headers: { 'X-Auth-Token': process.env.FOOTBALL_DATA_TOKEN as string },
      next: { revalidate: 60 }, 
    });

    if (!res.ok) throw new Error('Falha na API primária');
    const data = await res.json();

    const gols = data.goals ? data.goals.map((g: any) => ({
      minute: g.minute,
      scorer: { name: g.scorer?.name || 'Jogador' },
      team: { name: g.team?.name || 'Time' }
    })) : [];

    return NextResponse.json({
      status: data.status,
      utcDate: data.utcDate,
      homeTeam: data.homeTeam,
      awayTeam: data.awayTeam,
      score: data.score,
      venue: data.venue || 'Não informado',
      referees: data.referees && data.referees.length > 0 ? [{ name: data.referees[0].name }] : [{ name: 'Não informado' }],
      goals: gols
    });

  } catch (error) {
    return NextResponse.json({ message: 'Erro ao carregar partida' }, { status: 500 });
  }
}