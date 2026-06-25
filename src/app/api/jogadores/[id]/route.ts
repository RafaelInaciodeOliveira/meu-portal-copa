import { NextResponse } from 'next/server';

// Função mágica para limpar acentos (Ex: "Mbappé" -> "Mbappe", "Vinícius" -> "Vinicius")
function removerAcentos(texto: string) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export async function GET(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const playerName = decodeURIComponent(id);
  
  // Limpamos o nome antes de enviar para a API
  const safePlayerName = removerAcentos(playerName);
  
  const leagueId = "1";
  const season = "2022"; 
  
  console.log(`🔍 Pesquisando jogador: ${safePlayerName} na Copa de ${season}`);

  try {
    // 1ª Tentativa com o nome limpo
    let res = await fetch(`https://v3.football.api-sports.io/players?search=${safePlayerName}&league=${leagueId}&season=${season}`, {
      headers: { 'x-apisports-key': process.env.API_FOOTBALL_KEY as string },
      next: { revalidate: 3600 },
    });
    let data = await res.json();

    if (data.errors && Object.keys(data.errors).length > 0) {
      console.log("⚠️ Erro (Tentativa 1):", data.errors);
    }

    // 2ª Tentativa: Busca só pelo sobrenome (também limpo)
    if (!data.response || data.response.length === 0) {
      const nameParts = safePlayerName.split(' ');
      const lastName = nameParts[nameParts.length - 1]; 
      
      console.log(`⚠️ Nome completo falhou. Tentando sobrenome: ${lastName}`);
      
      res = await fetch(`https://v3.football.api-sports.io/players?search=${lastName}&league=${leagueId}&season=${season}`, {
        headers: { 'x-apisports-key': process.env.API_FOOTBALL_KEY as string },
      });
      data = await res.json();
    }

    if (!data.response || data.response.length === 0) {
      return NextResponse.json({ message: 'Jogador não encontrado' }, { status: 404 });
    }

    const jogador = data.response[0].player;
    const estatisticas = data.response[0].statistics[0];

    return NextResponse.json({
      nome: jogador.name,
      foto: jogador.photo,
      idade: jogador.age,
      nacionalidade: jogador.nationality,
      peso: jogador.weight,
      altura: jogador.height,
      clube: estatisticas?.team?.name,
      escudoClube: estatisticas?.team?.logo,
      posicao: estatisticas?.games?.position
    });
  } catch (error) {
    console.error("Erro na API de jogadores:", error);
    return NextResponse.json({ message: 'Erro ao carregar jogador' }, { status: 500 });
  }
}