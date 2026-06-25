'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function EstatisticasPage() {
  // Controle dos Modais
  const [jogadorClicado, setJogadorClicado] = useState<string | null>(null);
  const [timeAtaqueClicado, setTimeAtaqueClicado] = useState<any>(null); // Novo estado para o time clicado

  // Trava o scroll quando qualquer modal abre
  useEffect(() => {
    if (jogadorClicado || timeAtaqueClicado) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [jogadorClicado, timeAtaqueClicado]);

  // Buscas na API
  const { data: dataArtilheiros, isLoading: loadArtilheiros, error: errorArtilheiros } = useSWR('/api/artilheiros', fetcher);
  const { data: dataClassificacao, isLoading: loadClassificacao } = useSWR('/api/classificacao', fetcher);
  const { data: dadosJogador, isLoading: loadDadosJogador } = useSWR(jogadorClicado ? `/api/jogadores/${jogadorClicado}` : null, fetcher);

  // Processamento de Dados
  const jogadores = dataArtilheiros?.scorers || [];

  const topArtilheiros = [...jogadores]
    .sort((a: any, b: any) => b.goals - a.goals)
    .slice(0, 10);

  const topAssistencias = [...jogadores]
    .filter((j: any) => j.assists && j.assists > 0)
    .sort((a: any, b: any) => b.assists - a.assists)
    .slice(0, 10);

  const todosOsTimes = dataClassificacao?.standings
    ?.filter((tabela: any) => tabela.type === 'TOTAL')
    .map((grupo: any) => grupo.table)
    .flat() || [];

  const melhoresAtaques = [...todosOsTimes]
    .sort((a: any, b: any) => b.goalsFor - a.goalsFor)
    .slice(0, 5);

  const melhoresDefesas = [...todosOsTimes]
    .sort((a: any, b: any) => a.goalsAgainst - b.goalsAgainst)
    .slice(0, 5);

  // Filtra os artilheiros apenas do time clicado (para o modal novo)
  const artilheirosDoTime = timeAtaqueClicado 
    ? jogadores.filter((j: any) => j.team.id === timeAtaqueClicado.id).sort((a: any, b: any) => b.goals - a.goals)
    : [];

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
              <Link href="/" className="hover:text-white transition">Ao Vivo</Link>
              <Link href="/grupos" className="hover:text-white transition">Grupos</Link>
              <Link href="/estatisticas" className="text-white hover:text-emerald-400 transition">Estatísticas</Link>
              <Link href="#" className="hover:text-white transition">Notícias</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto p-4 py-8 flex flex-col gap-12">
        <header>
          <h2 className="text-3xl font-black text-white">Painel de Estatísticas</h2>
          <p className="text-zinc-400 mt-2">Os grandes números, artilheiros e os elencos de destaque da competição.</p>
        </header>

        {errorArtilheiros && (
          <p className="text-red-500 text-center py-10">Erro ao carregar as estatísticas.</p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* ==========================================
              COLUNA 1: ARTILHEIROS (CHUTEIRA DE OURO)
              ========================================== */}
          <section className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 h-fit">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              Chuteira de Ouro (Gols)
            </h3>
            <div className="flex flex-col">
              {loadArtilheiros ? (
                <div className="space-y-4 animate-pulse">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-4">
                        <div className="w-4 h-4 bg-zinc-800 rounded"></div>
                        <div className="w-24 h-4 bg-zinc-800 rounded"></div>
                        <div className="w-6 h-6 rounded-full bg-zinc-800"></div>
                      </div>
                      <div className="w-8 h-8 bg-zinc-800 rounded-md"></div>
                    </div>
                  ))}
                </div>
              ) : topArtilheiros.length === 0 ? (
                <p className="text-zinc-500 text-sm">Nenhum gol registrado.</p>
              ) : (
                topArtilheiros.map((scorer: any, index: number) => (
                  <div 
                    key={`gol-${scorer.player.id}`} 
                    onClick={() => setJogadorClicado(scorer.player.name)}
                    className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 hover:bg-zinc-800/30 px-3 -mx-3 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-zinc-600 font-bold w-4 text-sm">{index + 1}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{scorer.player.name}</span>
                        <img src={scorer.team.crest} alt={scorer.team.name} className="w-4 h-4 object-contain" title={scorer.team.name} />
                      </div>
                    </div>
                    <div className="bg-zinc-900 px-3 py-1 rounded-md border border-white/5">
                      <span className="text-emerald-400 font-bold">{scorer.goals}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* ==========================================
              COLUNA 2: GARÇONS (ASSISTÊNCIAS)
              ========================================== */}
          <section className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 h-fit">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              Top Garçons (Assistências)
            </h3>
            <div className="flex flex-col">
              {loadArtilheiros ? (
                <div className="space-y-4 animate-pulse">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-4">
                        <div className="w-4 h-4 bg-zinc-800 rounded"></div>
                        <div className="w-24 h-4 bg-zinc-800 rounded"></div>
                        <div className="w-6 h-6 rounded-full bg-zinc-800"></div>
                      </div>
                      <div className="w-8 h-8 bg-zinc-800 rounded-md"></div>
                    </div>
                  ))}
                </div>
              ) : topAssistencias.length === 0 ? (
                <p className="text-zinc-500 text-sm">Nenhuma assistência computada pela API ainda.</p>
              ) : (
                topAssistencias.map((scorer: any, index: number) => (
                  <div 
                    key={`ast-${scorer.player.id}`} 
                    onClick={() => setJogadorClicado(scorer.player.name)}
                    className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 hover:bg-zinc-800/30 px-3 -mx-3 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-zinc-600 font-bold w-4 text-sm">{index + 1}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{scorer.player.name}</span>
                        <img src={scorer.team.crest} alt={scorer.team.name} className="w-4 h-4 object-contain" title={scorer.team.name} />
                      </div>
                    </div>
                    <div className="bg-zinc-900 px-3 py-1 rounded-md border border-white/5">
                      <span className="text-blue-400 font-bold">{scorer.assists}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* ==========================================
              COLUNA 3: MELHOR ATAQUE
              ========================================== */}
          <section className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 h-fit">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              Melhor Ataque
            </h3>
            <div className="flex flex-col gap-3">
              {loadClassificacao ? (
                <div className="space-y-3 animate-pulse">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-zinc-800/50 rounded-xl border border-white/5"></div>
                  ))}
                </div>
              ) : (
                melhoresAtaques.map((linha: any, index: number) => (
                  <div 
                    key={linha.team.id} 
                    onClick={() => setTimeAtaqueClicado(linha.team)}
                    className="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-white/5 hover:bg-zinc-800/80 transition-colors cursor-pointer group"
                    title="Ver autores dos gols"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-600 font-black text-sm w-3">{index + 1}</span>
                      <img src={linha.team.crest} alt={linha.team.shortName} className="w-6 h-6 object-contain" />
                      <span className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">{linha.team.shortName}</span>
                    </div>
                    <div className="text-emerald-400 font-black">{linha.goalsFor} <span className="text-xs text-zinc-500 font-normal">Gols Pró</span></div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* ==========================================
              COLUNA 4: PAREDÕES (DEFESA)
              ========================================== */}
          <section className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 h-fit">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              Paredões (Melhor Defesa)
            </h3>
            <div className="flex flex-col gap-3">
              {loadClassificacao ? (
                <div className="space-y-3 animate-pulse">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-zinc-800/50 rounded-xl border border-white/5"></div>
                  ))}
                </div>
              ) : (
                melhoresDefesas.map((linha: any, index: number) => (
                  <div key={linha.team.id} className="flex items-center justify-between bg-zinc-950 p-3 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-600 font-black text-sm w-3">{index + 1}</span>
                      <img src={linha.team.crest} alt={linha.team.shortName} className="w-6 h-6 object-contain" />
                      <span className="font-bold text-white text-sm">{linha.team.shortName}</span>
                    </div>
                    <div className="text-blue-400 font-black">{linha.goalsAgainst} <span className="text-xs text-zinc-500 font-normal">Gols Sofridos</span></div>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </main>

      {/* MODAL 1: RAIO-X DO JOGADOR */}
      {jogadorClicado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-white/10 rounded-3xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-zinc-900/50">
              <h3 className="text-xl font-black text-white">Raio-X do Atleta</h3>
              <button onClick={() => setJogadorClicado(null)} className="text-zinc-500 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-full w-8 h-8 flex items-center justify-center transition-colors">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {loadDadosJogador ? (
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

      {/* MODAL 2: ARTILHEIROS DO TIME (ACIONADO PELO MELHOR ATAQUE) */}
      {timeAtaqueClicado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-white/10 rounded-3xl w-full max-w-md max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-zinc-900/50">
              <div className="flex items-center gap-4">
                <img src={timeAtaqueClicado.crest} alt={timeAtaqueClicado.name} className="w-10 h-10 object-contain" />
                <div>
                  <h3 className="text-xl font-black text-white">Gols Marcados</h3>
                  <p className="text-sm text-zinc-400">{timeAtaqueClicado.name}</p>
                </div>
              </div>
              <button onClick={() => setTimeAtaqueClicado(null)} className="text-zinc-500 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-full w-8 h-8 flex items-center justify-center transition-colors">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {artilheirosDoTime.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {artilheirosDoTime.map((scorer: any) => (
                    <div key={scorer.player.id} className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                      <span className="font-bold text-white">{scorer.player.name}</span>
                      <div className="flex flex-col items-center">
                        <span className="text-emerald-400 font-black leading-none">{scorer.goals}</span>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Gols</span>
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 p-3 bg-zinc-900 rounded-lg border border-white/5 text-center">
                    <p className="text-xs text-zinc-500">
                      Exibindo principais goleadores mapeados. Gols contra ou jogadores fora do top ranking podem não aparecer nesta listagem.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-zinc-500 text-sm">Detalhes individuais dos gols desta seleção não estão mapeados no momento.</p>
                </div>
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