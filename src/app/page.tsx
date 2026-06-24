'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const [abaAtiva, setAbaAtiva] = useState<'PROXIMOS' | 'RESULTADOS'>('PROXIMOS');

  const { data: dataJogos, error: erroJogos, isLoading: loadJogos } = useSWR('/api/jogos', fetcher, {
    refreshInterval: 15000, 
  });

  const { data: dataArtilheiros, isLoading: loadArtilheiros } = useSWR('/api/artilheiros', fetcher);

  const todosOsJogos = dataJogos?.matches || [];
  
  // AQUI ESTÁ A CORREÇÃO: Força a mostrar apenas os 10 primeiros
  const topArtilheiros = dataArtilheiros?.scorers?.slice(0, 10) || [];

  const jogosProximos = todosOsJogos
    .filter((jogo: any) => ['IN_PLAY', 'PAUSED', 'TIMED', 'SCHEDULED'].includes(jogo.status))
    .sort((a: any, b: any) => {
      const aIsLive = a.status === 'IN_PLAY' || a.status === 'PAUSED';
      const bIsLive = b.status === 'IN_PLAY' || b.status === 'PAUSED';
      if (aIsLive && !bIsLive) return -1;
      if (!aIsLive && bIsLive) return 1;
      return new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime();
    });

  const jogosResultados = todosOsJogos
    .filter((jogo: any) => jogo.status === 'FINISHED')
    .sort((a: any, b: any) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime());

  const jogosExibidos = abaAtiva === 'PROXIMOS' ? jogosProximos : jogosResultados;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 pb-10">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-black tracking-tighter text-white">
              COPA<span className="text-emerald-500">PORTAL</span>
            </h1>
            <div className="hidden md:flex gap-6 text-sm font-medium text-zinc-400">
              <Link href="/" className="text-white hover:text-emerald-400 transition">Ao Vivo</Link>
              <Link href="/grupos" className="hover:text-white transition">Grupos</Link>
              <Link href="/estatisticas" className="hover:text-white transition">Estatísticas</Link>
              <Link href="#" className="hover:text-white transition">Notícias</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto p-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <section className="lg:col-span-2 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                  Transmissão Oficial
                </h2>
              </div>
              
              <div className="w-full bg-zinc-900 rounded-2xl border border-white/10 shadow-xl overflow-hidden relative flex flex-col md:flex-row items-center justify-between p-6 gap-6">
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-red-600/10 rounded-full blur-3xl animate-pulse"></div>
                
                <div className="relative z-10 flex items-center gap-5 text-left w-full md:w-auto">
                  <div className="bg-zinc-950 p-4 rounded-full border border-white/5 hidden sm:flex">
                    <span className="text-3xl">📺</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Acompanhe os Jogos ao Vivo</h3>
                    <p className="text-sm text-zinc-400">
                      Assista com imagens diretamente no canal da CazéTV.
                    </p>
                  </div>
                </div>

                <a 
                  href="https://www.youtube.com/@CazeTV/live" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="relative z-10 w-full md:w-auto justify-center bg-[#ff0000] hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-3 transition-all hover:scale-105 shadow-lg shadow-red-900/20 whitespace-nowrap"
                >
                  <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                  Assistir ao Vivo
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Chuteira de Ouro (Top Artilheiros)
              </h2>
              
              <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
                {loadArtilheiros ? (
                  <p className="text-sm text-zinc-500 text-center py-4">Buscando artilheiros...</p>
                ) : topArtilheiros.length === 0 ? (
                  <p className="text-sm text-zinc-500 text-center py-4">Nenhum gol marcado na competição ainda.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-rows-5 md:grid-flow-col md:auto-cols-fr gap-4">
                    {topArtilheiros.map((scorer: any, index: number) => (
                      <div key={scorer.player.id} className="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-all">
                        
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-3">
                            <span className="text-zinc-600 font-black text-lg w-4">{index + 1}</span>
                            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 font-bold overflow-hidden relative">
                              {scorer.player.name.charAt(0)}
                            </div>
                          </div>
                          
                          <div className="flex flex-col">
                            <span className="font-bold text-white text-sm line-clamp-1">{scorer.player.name}</span>
                            <div className="flex items-center gap-1">
                              <img src={scorer.team.crest} alt={scorer.team.name} className="w-3 h-3" />
                              <span className="text-xs text-zinc-500">{scorer.team.name}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-center justify-center bg-zinc-900 px-3 py-1 rounded-lg border border-white/5">
                          <span className="text-emerald-400 font-black text-lg leading-none">{scorer.goals}</span>
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Gols</span>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </section>

          <section className="flex flex-col gap-4 h-full">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Central de Jogos
            </h2>
            
            <div className="flex p-1 bg-zinc-900 rounded-lg border border-white/5">
              <button 
                onClick={() => setAbaAtiva('PROXIMOS')}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-300 ${
                  abaAtiva === 'PROXIMOS' 
                  ? 'bg-emerald-500 text-zinc-950 shadow-md' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                Ao Vivo / Próximos
              </button>
              <button 
                onClick={() => setAbaAtiva('RESULTADOS')}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all duration-300 ${
                  abaAtiva === 'RESULTADOS' 
                  ? 'bg-zinc-700 text-white shadow-md' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                Resultados
              </button>
            </div>

            <div className="flex-1 bg-zinc-900/50 border border-white/5 rounded-2xl p-4 overflow-y-auto max-h-[595px] scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
              
              {loadJogos && (
                <div className="flex flex-col items-center justify-center h-40 gap-3">
                  <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-zinc-500">Sincronizando dados...</p>
                </div>
              )}

              {!loadJogos && !erroJogos && jogosExibidos.length === 0 && (
                <div className="text-center mt-10 text-zinc-500 text-sm">
                  Nenhum jogo encontrado para esta categoria.
                </div>
              )}

              <div className="space-y-3">
                {!loadJogos && !erroJogos && jogosExibidos.map((jogo: any) => {
                  const isAoVivo = jogo.status === 'IN_PLAY' || jogo.status === 'PAUSED';
                  const isEncerrado = jogo.status === 'FINISHED';
                  const isFuturo = jogo.status === 'TIMED' || jogo.status === 'SCHEDULED';
                  
                  const golsCasa = jogo.score?.fullTime?.home ?? jogo.score?.regularTime?.home ?? 0;
                  const golsFora = jogo.score?.fullTime?.away ?? jogo.score?.regularTime?.away ?? 0;

                  return (
                    <div key={jogo.id} className={`group bg-zinc-900 hover:bg-zinc-800 rounded-xl p-4 border transition-all duration-300 ${isAoVivo ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-white/5 hover:border-zinc-600'}`}>
                      <div className="flex justify-between items-center mb-4">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded ${
                          isAoVivo ? 'bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse' : 
                          isEncerrado ? 'bg-zinc-800 text-zinc-400' : 
                          'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {isEncerrado ? 'Encerrado' : isAoVivo ? '🔴 Ao Vivo' : 'A Iniciar'}
                        </span>
                        <span className="text-xs text-zinc-500 font-medium">
                          {isFuturo 
                            ? new Date(jogo.utcDate).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) 
                            : new Date(jogo.utcDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col items-center gap-2 w-[35%]">
                          <img src={jogo.homeTeam.crest} alt={jogo.homeTeam.shortName} className="w-8 h-8 object-contain drop-shadow-lg group-hover:scale-110 transition-transform" />
                          <span className="font-semibold text-sm text-center line-clamp-1">{jogo.homeTeam.shortName}</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 w-[30%] font-black text-2xl">
                          {isFuturo ? (
                            <span className="text-zinc-600 text-lg">- x -</span>
                          ) : (
                            <>
                              <span className={golsCasa > golsFora ? 'text-emerald-400' : 'text-white'}>{golsCasa}</span>
                              <span className="text-zinc-700 text-sm font-normal">x</span>
                              <span className={golsFora > golsCasa ? 'text-emerald-400' : 'text-white'}>{golsFora}</span>
                            </>
                          )}
                        </div>
                        <div className="flex flex-col items-center gap-2 w-[35%]">
                          <img src={jogo.awayTeam.crest} alt={jogo.awayTeam.shortName} className="w-8 h-8 object-contain drop-shadow-lg group-hover:scale-110 transition-transform" />
                          <span className="font-semibold text-sm text-center line-clamp-1">{jogo.awayTeam.shortName}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* RODAPÉ COM SUA ASSINATURA */}
      <footer className="w-full max-w-7xl mx-auto px-4 py-8 mt-auto border-t border-white/5 flex items-center justify-center">
        <p className="text-sm text-zinc-500">
          Desenvolvido com <span className="text-emerald-500">💚</span> e muito código por <span className="font-bold text-zinc-300">Rafael Inacio</span>.
        </p>
      </footer>

    </div>
  );
}