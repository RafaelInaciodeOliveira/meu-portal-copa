'use client';

import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Grupos() {
  const { data, isLoading, error } = useSWR('/api/classificacao', fetcher);

  // A API retorna um array chamado "standings". Queremos pegar apenas as tabelas normais (tipo "TOTAL")
  const tabelasDosGrupos = data?.standings?.filter((tabela: any) => tabela.type === 'TOTAL') || [];

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
              <Link href="/grupos" className="text-white hover:text-emerald-400 transition">Grupos</Link>
              <Link href="/estatisticas" className="hover:text-white transition">Estatísticas</Link>
              <Link href="#" className="hover:text-white transition">Notícias</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto p-4 py-8 flex flex-col gap-8">
        
        <header>
          <h2 className="text-3xl font-black text-white">Fase de Grupos</h2>
          <p className="text-zinc-400 mt-2">Classificação atualizada da Copa do Mundo.</p>
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

        {/* Grid dos Grupos (2 colunas no PC, 1 no celular) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {!isLoading && !error && tabelasDosGrupos.map((grupo: any) => (
            <div key={grupo.group} className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden">
              
              {/* Nome do Grupo */}
              <div className="bg-zinc-900 px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-bold text-white tracking-wide">
                  {grupo.group.replace('_', ' ')} {/* Troca "GROUP_A" por "GROUP A" */}
                </h3>
              </div>

              {/* Tabela */}
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
                      <tr key={linha.team.id} className="hover:bg-zinc-800/50 transition-colors">
                        
                        {/* Posição (Destaca os 2 primeiros em verde para os classificados) */}
                        <td className={`px-4 py-3 text-center font-bold ${index < 2 ? 'text-emerald-400' : 'text-zinc-600'}`}>
                          {linha.position}
                        </td>
                        
                        {/* Bandeira e Nome */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={linha.team.crest} alt={linha.team.shortName} className="w-5 h-5 object-contain" />
                            <span className="font-medium text-white whitespace-nowrap">{linha.team.shortName}</span>
                          </div>
                        </td>
                        
                        {/* Estatísticas Numéricas */}
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