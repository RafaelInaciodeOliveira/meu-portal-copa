'use client';

import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function EstatisticasPage() {
  const { data, isLoading, error } = useSWR('/api/artilheiros', fetcher);

  const jogadores = data?.scorers || [];

  // Top 10 Artilheiros (Gols)
  const topArtilheiros = [...jogadores]
    .sort((a: any, b: any) => b.goals - a.goals)
    .slice(0, 10);

  // Top 10 Garçons (Assistências)
  const topAssistencias = [...jogadores]
    .filter((j: any) => j.assists && j.assists > 0)
    .sort((a: any, b: any) => b.assists - a.assists)
    .slice(0, 10);

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
      <main className="max-w-7xl mx-auto p-4 py-8 flex flex-col gap-8">
        
        <header>
          <h2 className="text-3xl font-black text-white">Estatísticas Individuais</h2>
          <p className="text-zinc-400 mt-2">Os destaques e craques da Copa do Mundo.</p>
        </header>

        {isLoading && (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-zinc-500">Processando dados dos jogadores...</p>
          </div>
        )}

        {error && (
          <p className="text-red-500 text-center py-10">Erro ao carregar as estatísticas.</p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* COLUNA 1: ARTILHEIROS */}
          {!isLoading && !error && (
            <section className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">
                Chuteira de Ouro (Gols)
              </h3>
              
              <div className="flex flex-col">
                {topArtilheiros.length === 0 ? (
                  <p className="text-zinc-500 text-sm">Nenhum gol registrado.</p>
                ) : topArtilheiros.map((scorer: any, index: number) => (
                  <div key={`gol-${scorer.player.id}`} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 hover:bg-zinc-800/30 px-3 rounded-lg transition-colors">
                    
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
                ))}
              </div>
            </section>
          )}

          {/* COLUNA 2: ASSISTÊNCIAS */}
          {!isLoading && !error && (
            <section className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">
                Top Garçons (Assistências)
              </h3>
              
              <div className="flex flex-col">
                {topAssistencias.length === 0 ? (
                  <p className="text-zinc-500 text-sm">Nenhuma assistência computada pela API ainda.</p>
                ) : topAssistencias.map((scorer: any, index: number) => (
                  <div key={`ast-${scorer.player.id}`} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 hover:bg-zinc-800/30 px-3 rounded-lg transition-colors">
                    
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
                ))}
              </div>
            </section>
          )}

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