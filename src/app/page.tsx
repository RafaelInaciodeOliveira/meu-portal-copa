'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const [abaAtiva, setAbaAtiva] = useState<'PROXIMOS' | 'RESULTADOS'>('PROXIMOS');
  
  // ESTADOS DOS MODAIS
  const [jogoClicado, setJogoClicado] = useState<number | null>(null);
  const [jogadorClicado, setJogadorClicado] = useState<string | null>(null);

  // TRAVA O SCROLL DA TELA QUANDO UM MODAL ABRE
  useEffect(() => {
    if (jogoClicado || jogadorClicado) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [jogoClicado, jogadorClicado]);

  // BUSCAS NA API
  const { data: dataJogos, error: erroJogos, isLoading: loadJogos } = useSWR('/api/jogos', fetcher, { refreshInterval: 15000 });
  const { data: dataArtilheiros, isLoading: loadArtilheiros } = useSWR('/api/artilheiros', fetcher);
  
  const { data: dadosJogo, isLoading: loadDadosJogo } = useSWR(jogoClicado ? `/api/jogos/${jogoClicado}` : null, fetcher);
  const { data: dadosJogador, isLoading: loadDadosJogador } = useSWR(jogadorClicado ? `/api/jogadores/${jogadorClicado}` : null, fetcher);

  const todosOsJogos = dataJogos?.matches || [];
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
      <nav className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-black tracking-tighter text-white">
              COPA<span className="text-emerald-500">PORTAL</span>
            </h1>
            <div className="hidden md:flex gap-6 text-sm font-medium text-zinc-400">
              <Link href="/" className="text-white hover:text-emerald-400 transition">Ao Vivo</Link>
              <Link href="/grupos" className="hover:text-white transition">Grupos</Link>
              <Link href="/estatisticas" className="hover:text-white transition">Estatísticas</Link>
              <Link href="/noticias" className="hover:text-white transition">Notícias</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto p-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <section className="lg:col-span-2 flex flex-col gap-8">
            {/* TRANSMISSÃO OFICIAL */}
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

            {/* ARTILHEIROS */}
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Chuteira de Ouro (Top Artilheiros)
              </h2>
              
              <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
                {loadArtilheiros ? (
                  /* =====================================
                     SKELETON LOADER - ARTILHEIROS
                     ===================================== */
                  <div className="grid grid-cols-1 md:grid-rows-5 md:grid-flow-col md:auto-cols-fr gap-4 animate-pulse">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between bg-zinc-950/50 p-3 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-zinc-800 rounded"></div>
                          <div className="w-10 h-10 rounded-full bg-zinc-800"></div>
                          <div className="flex flex-col gap-2">
                            <div className="w-24 h-3 bg-zinc-800 rounded"></div>
                            <div className="w-16 h-2 bg-zinc-800 rounded"></div>
                          </div>
                        </div>
                        <div className="w-8 h-10 bg-zinc-800 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : topArtilheiros.length === 0 ? (
                  <p className="text-sm text-zinc-500 text-center py-4">Nenhum gol marcado na competição ainda.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-rows-5 md:grid-flow-col md:auto-cols-fr gap-4">
                    {topArtilheiros.map((scorer: any, index: number) => (
                      <div 
                        key={scorer.player.id} 
                        onClick={() => setJogadorClicado(scorer.player.name)}
                        className="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-white/5 hover:border-emerald-500/50 hover:bg-zinc-900 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-3">
                            <span className="text-zinc-600 font-black text-lg w-4 group-hover:text-emerald-500 transition-colors">{index + 1}</span>
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

                        <div className="flex flex-col items-center justify-center bg-zinc-900 group-hover:bg-zinc-950 px-3 py-1 rounded-lg border border-white/5">
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

          {/* CENTRAL DE JOGOS */}
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
              {loadJogos ? (
                /* =====================================
                   SKELETON LOADER - CENTRAL DE JOGOS
                   ===================================== */
                <div className="space-y-3 animate-pulse">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-zinc-900/50 rounded-xl p-4 border border-white/5">
                      <div className="flex justify-between items-center mb-4">
                        <div className="h-4 bg-zinc-800 rounded w-16"></div>
                        <div className="h-3 bg-zinc-800 rounded w-12"></div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col items-center gap-2 w-[35%]">
                          <div className="w-8 h-8 rounded-full bg-zinc-800"></div>
                          <div className="h-3 bg-zinc-800 rounded w-16"></div>
                        </div>
                        <div className="h-6 bg-zinc-800 rounded w-12"></div>
                        <div className="flex flex-col items-center gap-2 w-[35%]">
                          <div className="w-8 h-8 rounded-full bg-zinc-800"></div>
                          <div className="h-3 bg-zinc-800 rounded w-16"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : !erroJogos && jogosExibidos.length === 0 ? (
                <div className="text-center mt-10 text-zinc-500 text-sm">
                  Nenhum jogo encontrado para esta categoria.
                </div>
              ) : (
                <div className="space-y-3">
                  {!erroJogos && jogosExibidos.map((jogo: any) => {
                    const isAoVivo = jogo.status === 'IN_PLAY' || jogo.status === 'PAUSED';
                    const isEncerrado = jogo.status === 'FINISHED';
                    const isFuturo = jogo.status === 'TIMED' || jogo.status === 'SCHEDULED';
                    
                    const golsCasa = jogo.score?.fullTime?.home ?? jogo.score?.regularTime?.home ?? 0;
                    const golsFora = jogo.score?.fullTime?.away ?? jogo.score?.regularTime?.away ?? 0;

                    return (
                      <div 
                        key={jogo.id} 
                        onClick={() => setJogoClicado(jogo.id)}
                        className={`group bg-zinc-900 hover:bg-zinc-800 cursor-pointer rounded-xl p-4 border transition-all duration-300 ${isAoVivo ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-white/5 hover:border-emerald-500/30'}`}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded ${
                            isAoVivo ? 'bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse' : 
                            isEncerrado ? 'bg-zinc-800 text-zinc-400' : 
                            'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            {isEncerrado ? 'Encerrado' : isAoVivo ? '🔴 Ao Vivo' : 'A Iniciar'}
                          </span>
                          <span className="text-xs text-zinc-500 font-medium group-hover:text-white transition-colors">
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
                          <div className="flex items-center justify-center gap-2 w-[30%] font-black text-2xl group-hover:scale-110 transition-transform">
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
              )}
            </div>
          </section>
        </div>
      </main>

      {/* MODAL 1: PERFIL DO JOGADOR */}
      {jogadorClicado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-white/10 rounded-3xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-zinc-900/50">
              <h3 className="text-xl font-black text-white">Raio-X do Atleta</h3>
              <button onClick={() => setJogadorClicado(null)} className="text-zinc-500 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-full w-8 h-8 flex items-center justify-center transition-colors">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {loadDadosJogador ? (
                /* =====================================
                   SKELETON LOADER - MODAL DO JOGADOR
                   ===================================== */
                <div className="flex flex-col items-center text-center gap-6 animate-pulse">
                  <div className="w-32 h-32 rounded-full bg-zinc-800"></div>
                  <div className="flex flex-col gap-2 items-center w-full">
                    <div className="w-48 h-6 bg-zinc-800 rounded"></div>
                    <div className="w-24 h-4 bg-zinc-800 rounded"></div>
                  </div>
                  <div className="w-full bg-zinc-900/50 rounded-xl p-4 grid grid-cols-2 gap-4">
                    <div className="h-10 bg-zinc-800 rounded"></div>
                    <div className="h-10 bg-zinc-800 rounded"></div>
                    <div className="h-10 bg-zinc-800 rounded"></div>
                    <div className="h-10 bg-zinc-800 rounded"></div>
                    <div className="col-span-2 h-14 bg-zinc-800 rounded mt-2"></div>
                  </div>
                </div>
              ) : dadosJogador && !dadosJogador.message ? (
                <div className="flex flex-col items-center text-center gap-6">
                  <div className="w-32 h-32 rounded-full border-4 border-emerald-500/20 p-1 shadow-[0_0_30px_rgba(16,185,129,0.15)] bg-zinc-900 flex items-center justify-center">
                    <span className="text-6xl font-black text-emerald-500">
                      {dadosJogador.nome.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-white">{dadosJogador.nome}</h4>
                    <p className="text-emerald-500 font-medium">{dadosJogador.posicao || 'Jogador'}</p>
                  </div>
                  <div className="w-full bg-zinc-900 rounded-xl p-4 grid grid-cols-2 gap-4 border border-white/5 text-left">
                    <div>
                      <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Nacionalidade</p>
                      <p className="text-sm text-white font-medium">{dadosJogador.nacionalidade || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Idade</p>
                      <p className="text-sm text-white font-medium">{dadosJogador.idade ? `${dadosJogador.idade} anos` : '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Altura</p>
                      <p className="text-sm text-white font-medium">{dadosJogador.altura || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Peso</p>
                      <p className="text-sm text-white font-medium">{dadosJogador.peso || '-'}</p>
                    </div>
                    {dadosJogador.clube && (
                      <div className="col-span-2 flex items-center justify-between bg-zinc-950 p-3 rounded-lg border border-white/5 mt-2">
                        <div className="flex flex-col">
                          <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Seleção</p>
                          <span className="text-white font-bold">{dadosJogador.clube}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-zinc-500">Dados do jogador não encontrados na base.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: MATCH CENTER (DETALHES DO JOGO) */}
      {jogoClicado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-white/10 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-zinc-900/50">
              <h3 className="text-xl font-black text-white">Match Center</h3>
              <button onClick={() => setJogoClicado(null)} className="text-zinc-500 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-full w-8 h-8 flex items-center justify-center transition-colors">✕</button>
            </div>
            <div className="p-6 overflow-y-auto">
              {loadDadosJogo ? (
                /* =====================================
                   SKELETON LOADER - MODAL DO JOGO
                   ===================================== */
                <div className="flex flex-col gap-6 animate-pulse">
                  <div className="flex items-center justify-center gap-6 bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
                    <div className="flex flex-col items-center gap-2 w-1/3">
                      <div className="w-16 h-16 rounded-full bg-zinc-800"></div>
                      <div className="h-4 bg-zinc-800 rounded w-16"></div>
                    </div>
                    <div className="flex flex-col items-center gap-2 w-1/3">
                      <div className="h-12 bg-zinc-800 rounded w-24"></div>
                      <div className="h-3 bg-zinc-800 rounded w-16"></div>
                    </div>
                    <div className="flex flex-col items-center gap-2 w-1/3">
                      <div className="w-16 h-16 rounded-full bg-zinc-800"></div>
                      <div className="h-4 bg-zinc-800 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-24 bg-zinc-900/50 rounded-xl"></div>
                    <div className="h-24 bg-zinc-900/50 rounded-xl"></div>
                  </div>
                  <div className="h-32 bg-zinc-900/50 rounded-xl"></div>
                </div>
              ) : dadosJogo ? (
                <div className="flex flex-col gap-6">
                  {/* Placar */}
                  <div className="flex items-center justify-center gap-6 bg-zinc-900 p-6 rounded-2xl border border-white/5">
                    <div className="flex flex-col items-center gap-2 w-1/3">
                      <img src={dadosJogo.homeTeam.crest} alt={dadosJogo.homeTeam.name} className="w-16 h-16 drop-shadow-lg" />
                      <span className="font-bold text-white text-center">{dadosJogo.homeTeam.shortName}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="text-4xl font-black text-white bg-zinc-950 px-4 py-2 rounded-xl border border-white/10">
                        {dadosJogo.score?.fullTime?.home ?? 0} - {dadosJogo.score?.fullTime?.away ?? 0}
                      </div>
                      <span className="text-xs text-emerald-500 font-bold uppercase mt-2">{dadosJogo.status}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 w-1/3">
                      <img src={dadosJogo.awayTeam.crest} alt={dadosJogo.awayTeam.name} className="w-16 h-16 drop-shadow-lg" />
                      <span className="font-bold text-white text-center">{dadosJogo.awayTeam.shortName}</span>
                    </div>
                  </div>

                  {/* Detalhes da Partida */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                      <p className="text-xs text-zinc-500 uppercase font-bold mb-2">🏟️ Informações</p>
                      <p className="text-sm text-white mb-1"><strong>Estádio:</strong> {dadosJogo.venue}</p>
                      <p className="text-sm text-white"><strong>Data:</strong> {new Date(dadosJogo.utcDate).toLocaleString('pt-BR')}</p>
                    </div>
                    <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                      <p className="text-xs text-zinc-500 uppercase font-bold mb-2">⚖️ Arbitragem</p>
                      <p className="text-sm text-white">
                        {dadosJogo.referees[0].name}
                      </p>
                    </div>
                  </div>

                  {/* EVENTOS DA PARTIDA */}
                  <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                    <h4 className="text-xs text-zinc-500 uppercase font-bold mb-4 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Súmula da Partida
                    </h4>
                    {dadosJogo.goals && dadosJogo.goals.length > 0 ? (
                      <div className="space-y-2">
                        {dadosJogo.goals.map((gol: any, index: number) => (
                          <div key={index} className="flex items-center gap-3 bg-zinc-950 p-3 rounded-lg border border-white/5">
                            <span className="text-emerald-500 font-bold text-sm w-8">{gol.minute}'</span>
                            <span className="text-white text-sm font-medium">{gol.scorer?.name}</span>
                            <span className="text-zinc-500 text-xs ml-auto">({gol.team?.name})</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 px-4 border border-dashed border-white/10 rounded-xl bg-zinc-950/30">
                        <svg className="w-8 h-8 text-zinc-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-sm text-zinc-300 font-semibold tracking-wide">Dados Indisponíveis</p>
                        <p className="text-xs text-center text-zinc-500 mt-2 max-w-[280px]">
                          Os eventos detalhados minuto a minuto desta partida ainda não foram processados pelo painel estatístico.
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                <p className="text-center text-zinc-500">Erro ao carregar partida.</p>
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