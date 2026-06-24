import { NextResponse } from 'next/server';

export async function GET(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  // O nosso 'id' agora vai ser o nome do jogador (ex: "Lionel Messi")
  const { id } = await params;
  
  // O decodeURIComponent tira os "%20" que o navegador coloca nos espaços
  const playerName = decodeURIComponent(id);
  
  try {
    // Chamando a API nova pesquisando pelo nome!
    const res = await fetch(`https://v3.football.api-sports.io/players?search=${playerName}`, {
      headers: {
        'x-apisports-key': process.env.API_FOOTBALL_KEY as string,
      },
      next: { revalidate: 3600 }, // Guarda no cache por 1 hora
    });

    if (!res.ok) {
      throw new Error('Falha ao buscar jogador na API-Football');
    }

    const data = await res.json();

    // Se não encontrou ninguém com esse nome, avisa o erro
    if (!data.response || data.response.length === 0) {
      return NextResponse.json({ message: 'Jogador não encontrado' }, { status: 404 });
    }

    // Pega o primeiro resultado da pesquisa (o jogador mais famoso com esse nome)
    const jogador = data.response[0].player;
    const estatisticas = data.response[0].statistics[0]; // Pega os dados do clube atual

    // Monta um "pacote" limpo e organizado para a nossa tela
    const dadosLimpos = {
      nome: jogador.name,
      foto: jogador.photo,
      idade: jogador.age,
      nacionalidade: jogador.nationality,
      peso: jogador.weight,
      altura: jogador.height,
      clube: estatisticas?.team?.name,
      escudoClube: estatisticas?.team?.logo,
      posicao: estatisticas?.games?.position
    };

    return NextResponse.json(dadosLimpos);
  } catch (error) {
    console.error("Erro na API de jogadores:", error);
    return NextResponse.json({ message: 'Erro ao carregar jogador' }, { status: 500 });
  }
}