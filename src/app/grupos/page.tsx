'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Grupos() {
  const { data, isLoading, error } = useSWR('/api/classificacao', fetcher);
  
  // Controle do Modal
  const [timeClicado, setTimeClicado] = useState<any>(null);
  
  // Trava scroll
  useEffect(() => {
    if (timeClicado) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [timeClicado]);

  // Busca jogadores
  const { data: dadosTime, isLoading: loadingTime } = useSWR(
    timeClicado ? `/api/times/${timeClicado.id}` : null,
    fetcher
  );

  const tabelasDosGrupos = data?.standings?.filter((tabela: any) => tabela.type === 'TOTAL') || [];

  // ==========================================
  // 🏆 ALGORITMO DOS MELHORES TERCEIROS
  // ==========================================
  const melhoresTerceiros = tabelasDosGrupos
    .map((grupo: any) => {
      const terceiro = grupo.table.find((linha: any) => linha.position === 3);
      // Limpa a string do grupo para evitar "Grupo Group B" (pega só a última letra)
      const letra = grupo.group.split(' ').pop().split('_').pop();
      if (terceiro) return { ...terceiro, letraGrupo: letra };
      return null;
    })
    .filter(Boolean)
    .sort((a: any, b: any) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      const golsA = a.goalsFor || 0;
      const golsB = b.goalsFor || 0;
      return golsB - golsA;
    });

  // Salva apenas os IDs dos 8 melhores terceiros para podermos pintar eles de laranja nos grupos
  const idsDosOitoMelhores = melhoresTerceiros.slice(0, 8).map((t: any) => t.team.id);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 pb-10">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-black tracking-tighter text-white">
              COPA<span className="text-emerald-500">PORTAL</span>
            </h1>
            <div className="hidden md:flex gap-6 text-sm font-medium text-zinc-400">
              <Link href="/" className="hover:text-white transition">Ao Vivo</Link>
              <Link href="/grupos" className="text-white hover:text-emerald-400 transition">Grupos</Link>
              <Link href="/estatisticas" className="hover:text-white transition">Estatísticas</Link>
              <Link href="#" className="hover:text-white transition">Notícias</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto p-4 py-8 flex flex-col gap-12">
        
        <header>
          <h2 className="text-3xl font-black text-white">Fase de Grupos</h2>
          <p className="text-zinc-400 mt-2">Classificação atualizada da Copa do Mundo. Clique em uma seleção para ver o elenco.</p>
        </header>

        {isLoading && (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-zinc-500">Buscando dados das tabelas...</p>
          </div>
        )}

        {error && (
          <p className="text-red-500 text-center py-10">Erro ao carregar a classificação.</p>
        )}

        {/* TABELAS DOS GRUPOS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {!isLoading && !error && tabelasDosGrupos.map((grupo: any) => (
            <div key={grupo.group} className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden">
              <div className="bg-zinc-900 px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-bold text-white tracking-wide">
                  {grupo.group.replace('_', ' ')}
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-zinc-950/50 text-xs text-zinc-500 uppercase font-semibold">
                    <tr>
                      <th className="px-4 py-3 w-8 text-center">#</th>
                      <th className="px-4 py-3">Seleção</th>
                      <th className="px-3 py-3 text-center" title="Pontos">P</th>
                      <th className="px-3 py-3 text-center" title="Jogos">J</th>
                      <th className="px-3 py-3 text-center" title="Vitórias">V</th>
                      <th className="px-3 py-3 text-center" title="Empates">E</th>
                      <th className="px-3 py-3 text-center" title="Derrotas">D</th>
                      <th className="px-3 py-3 text-center" title="Saldo de Gols">SG</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {grupo.table.map((linha: any, index: number) => (
                      <tr 
                        key={linha.team.id} 
                        onClick={() => setTimeClicado(linha.team)}
                        className="hover:bg-zinc-800/80 transition-colors cursor-pointer group"
                      >
                        {/* LÓGICA DE CORES: 1º e 2º Verde | 3º Classificado Laranja | Resto Cinza */}
                        <td className={`px-4 py-3 text-center font-bold ${
                          index < 2 
                            ? 'text-emerald-400' 
                            : (index === 2 && idsDosOitoMelhores.includes(linha.team.id))
                              ? 'text-orange-500'
                              : 'text-zinc-600'
                        }`}>
                          {linha.position}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={linha.team.crest} alt={linha.team.shortName} className="w-5 h-5 object-contain group-hover:scale-110 transition-transform" />
                            <span className="font-medium text-white whitespace-nowrap">{linha.team.shortName}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-center font-bold text-white">{linha.points}</td>
                        <td className="px-3 py-3 text-center text-zinc-400">{linha.playedGames}</td>
                        <td className="px-3 py-3 text-center text-zinc-400">{linha.won}</td>
                        <td className="px-3 py-3 text-center text-zinc-400">{linha.draw}</td>
                        <td className="px-3 py-3 text-center text-zinc-400">{linha.lost}</td>
                        <td className="px-3 py-3 text-center text-zinc-400 font-medium">{linha.goalDifference}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* SESSÃO: RANKING DOS MELHORES TERCEIROS */}
        {!isLoading && !error && melhoresTerceiros.length > 0 && (
          <section className="flex flex-col gap-6 mt-4 items-center justify-center w-full">
            <header className="flex flex-col gap-2 text-center max-w-xl">
              <h2 className="text-2xl font-black text-white justify-center flex items-center gap-2">
                Ranking dos 3º Colocados
              </h2>
              <p className="text-xs text-zinc-400">Na Copa de 2026, os 8 melhores terceiros colocados garantem vaga na fase de mata-mata.</p>
            </header>

            <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden w-full max-w-3xl shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-zinc-950/50 text-xs text-zinc-500 uppercase font-semibold">
                    <tr>
                      <th className="px-6 py-4 w-12 text-center">Rnk</th>
                      <th className="px-4 py-4">Seleção</th>
                      <th className="px-4 py-4 text-center">Grupo</th>
                      <th className="px-4 py-4 text-center text-white" title="Pontos">Pts</th>
                      <th className="px-4 py-4 text-center" title="Saldo de Gols">SG</th>
                      <th className="px-4 py-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {melhoresTerceiros.map((linha: any, index: number) => {
                      const classificado = index < 8; // Os 8 primeiros passam!
                      return (
                        <tr key={linha.team.id} className="hover:bg-zinc-800/50 transition-colors">
                          <td className="px-6 py-4 text-center font-black text-zinc-500">
                            {index + 1}º
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <img src={linha.team.crest} alt={linha.team.shortName} className="w-6 h-6 object-contain drop-shadow-md" />
                              <span className="font-bold text-white whitespace-nowrap">{linha.team.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center font-medium text-zinc-400">
                            Grupo {linha.letraGrupo}
                          </td>
                          <td className="px-4 py-4 text-center font-black text-white text-lg">
                            {linha.points}
                          </td>
                          <td className="px-4 py-4 text-center font-medium text-zinc-400">
                            {linha.goalDifference > 0 ? `+${linha.goalDifference}` : linha.goalDifference}
                          </td>
                          <td className="px-4 py-4 text-center">
                            {/* VOLTOU PARA VERDE NA PÍLULA DE CLASSIFICADO */}
                            <span className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full border ${
                              classificado 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}>
                              {classificado ? 'Classificado' : 'Eliminado'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* JANELA FLUTUANTE (MODAL) DO RAIO-X */}
      {timeClicado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            
            {/* Cabeçalho do Modal */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-zinc-900/50">
              <div className="flex items-center gap-4">
                <img src={timeClicado.crest} alt={timeClicado.name} className="w-14 h-14 object-contain" />
                <div>
                  <h3 className="text-2xl font-black text-white">{timeClicado.name}</h3>
                  <p className="text-sm text-zinc-400">Raio-X da Seleção</p>
                </div>
              </div>
              <button 
                onClick={() => setTimeClicado(null)} 
                className="text-zinc-500 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Corpo do Modal */}
            <div className="p-6 overflow-y-auto">
              {loadingTime ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-zinc-500">Convocando jogadores...</p>
                </div>
              ) : dadosTime?.squad?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dadosTime.squad.map((jogador: any) => (
                    <div key={jogador.id} className="flex items-center gap-3 bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500">
                        {jogador.shirtNumber || '-'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{jogador.name}</p>
                        <p className="text-xs text-emerald-500">{jogador.position || 'Técnico'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-zinc-500 py-10">Nenhum jogador encontrado para esta seleção no momento.</p>
              )}
            </div>

          </div>
        </div>
      )}

      {/* RODAPÉ */}
      <footer className="w-full max-w-7xl mx-auto px-4 py-8 mt-auto border-t border-white/5 flex items-center justify-center">
        <p className="text-sm text-zinc-500">
          Desenvolvido com <span className="text-emerald-500">💚</span> e muito código por <span className="font-bold text-zinc-300">Rafael Inacio</span>.
        </p>
      </footer>

    </div>
  );
}