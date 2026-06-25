'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function NoticiasPage() {
  const { data, isLoading, error } = useSWR('/api/noticias', fetcher);
  
  // Estado para abrir e ler a notícia completa em um modal
  const [noticiaAberta, setNoticiaAberta] = useState<any>(null);

  const listaDeNoticias = data?.noticias || [];

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
              <Link href="/estatisticas" className="hover:text-white transition">Estatísticas</Link>
              <Link href="/noticias" className="text-white hover:text-emerald-400 transition">Notícias</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto p-4 py-8 flex flex-col gap-8">
        
        <header>
          <h2 className="text-3xl font-black text-white">Portal de Notícias</h2>
          <p className="text-zinc-400 mt-2">Cobertura completa, bastidores e informações exclusivas direto da Copa do Mundo.</p>
        </header>

        {error && (
          <p className="text-red-500 text-center py-10">Erro ao carregar o feed de notícias.</p>
        )}

        {/* FEED DE NOTÍCIAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* ==========================================
              SKELETON LOADER - NOTÍCIAS PULSANDO
              ========================================== */}
          {isLoading && (
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden animate-pulse flex flex-col h-[400px]">
                <div className="w-full h-48 bg-zinc-800"></div>
                <div className="p-6 flex flex-col gap-3 flex-1">
                  <div className="w-20 h-3 bg-zinc-800 rounded"></div>
                  <div className="w-full h-5 bg-zinc-800 rounded mt-2"></div>
                  <div className="w-3/4 h-5 bg-zinc-800 rounded"></div>
                  <div className="w-full h-3 bg-zinc-800 rounded mt-4"></div>
                  <div className="w-full h-3 bg-zinc-800 rounded"></div>
                  <div className="w-24 h-4 bg-zinc-800 rounded mt-auto"></div>
                </div>
              </div>
            ))
          )}

          {/* NOTÍCIAS REAIS VINDA DO MONGO */}
          {!isLoading && !error && listaDeNoticias.length === 0 ? (
            <div className="col-span-full text-center py-12 border border-dashed border-white/10 rounded-2xl bg-zinc-900/20">
              <p className="text-zinc-500 text-sm">Nenhuma notícia publicada no portal ainda.</p>
              <Link href="/admin" className="text-emerald-400 font-bold text-sm mt-2 inline-block hover:underline">
                Ir para o Painel Admin
              </Link>
            </div>
          ) : (
            !isLoading && !error && listaDeNoticias.map((noticia: any) => (
              <article 
                key={noticia._id}
                onClick={() => setNoticiaAberta(noticia)}
                className="bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden shadow-xl hover:border-emerald-500/30 transition-all cursor-pointer flex flex-col h-[420px] group"
              >
                {/* Imagem de Capa (Usa uma padrão cinza caso você não tenha colocado URL no formulário) */}
                <div className="w-full h-48 bg-zinc-900 relative overflow-hidden flex-shrink-0 border-b border-white/5 flex items-center justify-center text-zinc-700 font-bold text-xs bg-gradient-to-br from-zinc-900 to-zinc-950">
                  {noticia.imagemUrl ? (
                    <img 
                      src={noticia.imagemUrl} 
                      alt={noticia.titulo} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <span>COPA PORTAL IMAGEM</span>
                  )}
                </div>

                {/* Textos do Card */}
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500">
                    {new Date(noticia.dataCriacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </span>
                  
                  <h3 className="text-lg font-black text-white mt-2 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                    {noticia.titulo}
                  </h3>
                  
                  <p className="text-sm text-zinc-400 mt-2 line-clamp-3 font-medium">
                    {noticia.subtitulo}
                  </p>
                  
                  <span className="text-xs font-bold text-emerald-500 mt-auto group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Ler matéria completa &rarr;
                  </span>
                </div>
              </article>
            ))
          )}

        </div>
      </main>

      {/* MODAL PARA LEITURA DA MATÉRIA COMPLETA */}
      {noticiaAberta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-950 border border-white/10 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            
            {/* Cabeçalho do Modal */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-zinc-900/50">
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500">
                  {new Date(noticiaAberta.dataCriacao).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </span>
                <h3 className="text-xl font-black text-white mt-1">{noticiaAberta.titulo}</h3>
              </div>
              <button 
                onClick={() => setNoticiaAberta(null)} 
                className="text-zinc-500 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-full w-8 h-8 flex items-center justify-center transition-colors flex-shrink-0 ml-4"
              >
                ✕
              </button>
            </div>
            
            {/* Corpo com a notícia completa */}
            <div className="p-6 overflow-y-auto flex flex-col gap-6">
              {noticiaAberta.imagemUrl && (
                <div className="w-full h-64 bg-zinc-900 rounded-xl overflow-hidden border border-white/5">
                  <img src={noticiaAberta.imagemUrl} alt={noticiaAberta.titulo} className="w-full h-full object-cover" />
                </div>
              )}

              <p className="text-base text-zinc-300 font-bold italic border-l-2 border-emerald-500 pl-4">
                {noticiaAberta.subtitulo}
              </p>

              {/* Preserva as quebras de linha que você der no formulário usando white-space-pre-line */}
              <div className="text-zinc-300 text-sm leading-relaxed tracking-wide font-medium whitespace-pre-line">
                {noticiaAberta.conteudo}
              </div>
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