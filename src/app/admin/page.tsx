'use client';

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AdminPainel() {
  // Controle de Acesso
  const [autenticado, setAutenticado] = useState(false);
  const [senhaInput, setSenhaInput] = useState('');
  const [erroSenha, setErroSenha] = useState(false);

  // Busca as notícias do banco
  const { data, isLoading, mutate } = useSWR('/api/noticias', fetcher);
  const listaDeNoticias = data?.noticias || [];

  // Estados do Formulário e Gerenciamento
  const [idEditando, setIdEditando] = useState<string | null>(null);
  const [titulo, setTitulo] = useState('');
  const [subtitulo, setSubtitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  
  // Estados de Feedback
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (senhaInput === 'copa2026') {
      setAutenticado(true);
      setErroSenha(false);
    } else {
      setErroSenha(true);
    }
  };

  const limparFormulario = () => {
    setIdEditando(null);
    setTitulo('');
    setSubtitulo('');
    setConteudo('');
    setImagemUrl('');
    setMensagem({ texto: '', tipo: '' });
  };

  const carregarParaEdicao = (noticia: any) => {
    setIdEditando(noticia._id);
    setTitulo(noticia.titulo);
    setSubtitulo(noticia.subtitulo);
    setConteudo(noticia.conteudo);
    setImagemUrl(noticia.imagemUrl || '');
    setMensagem({ texto: 'Modo de edição ativado.', tipo: 'info' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensagem({ texto: '', tipo: '' });

    const metodo = idEditando ? 'PUT' : 'POST';
    const url = idEditando ? `/api/noticias/${idEditando}` : '/api/noticias';

    try {
      const res = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, subtitulo, conteudo, imagemUrl }),
      });

      if (res.ok) {
        setMensagem({ texto: idEditando ? 'Notícia atualizada!' : 'Notícia publicada!', tipo: 'sucesso' });
        limparFormulario();
        mutate(); // Recarrega a lista de notícias na hora
      } else {
        const errorData = await res.json();
        setMensagem({ texto: errorData.message || 'Erro ao salvar.', tipo: 'erro' });
      }
    } catch (error) {
      setMensagem({ texto: 'Erro de conexão.', tipo: 'erro' });
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async (id: string) => {
    const confirmar = window.confirm("Tem certeza que deseja excluir esta notícia permanentemente?");
    if (!confirmar) return;

    try {
      const res = await fetch(`/api/noticias/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        mutate(); // Atualiza a lista removendo o item
        if (id === idEditando) limparFormulario();
      } else {
        alert('Erro ao excluir a notícia.');
      }
    } catch (error) {
      alert('Erro de conexão ao tentar excluir.');
    }
  };

  // TELA DE LOGIN
  if (!autenticado) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 selection:bg-emerald-500/30">
        <form onSubmit={handleLogin} className="bg-zinc-900 border border-white/10 p-8 rounded-2xl w-full max-w-sm flex flex-col gap-6 shadow-2xl">
          <div className="text-center">
            <h1 className="text-2xl font-black text-white">Acesso Restrito</h1>
            <p className="text-zinc-400 text-sm mt-1">Painel Administrativo</p>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-zinc-300">Senha de Acesso</label>
            <input 
              type="password" 
              value={senhaInput}
              onChange={(e) => setSenhaInput(e.target.value)}
              className="bg-zinc-950 border border-white/5 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Digite a senha"
            />
            {erroSenha && <span className="text-red-500 text-xs font-semibold">Senha incorreta.</span>}
          </div>

          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-colors">
            Entrar no Painel
          </button>
          
          <Link href="/" className="text-center text-sm text-zinc-500 hover:text-white transition-colors">
            Voltar ao site público
          </Link>
        </form>
      </div>
    );
  }

  // TELA DO DASHBOARD
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 pb-10">
      
      <nav className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-black tracking-tighter text-white">
            ADMIN<span className="text-emerald-500">PORTAL</span>
          </h1>
          <div className="flex gap-6 items-center">
            <Link href="/noticias" className="text-sm font-medium text-zinc-400 hover:text-white transition">
              Ver Site
            </Link>
            <button onClick={() => setAutenticado(false)} className="text-sm font-bold text-red-500 hover:text-red-400 transition">
              Sair
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 py-8">
        <header className="mb-8">
          <h2 className="text-3xl font-black text-white">Gestão de Conteúdo</h2>
          <p className="text-zinc-400 mt-2">Crie, edite ou remova as publicações do portal.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUNA ESQUERDA: FORMULÁRIO */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSalvar} className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl flex flex-col gap-6 shadow-xl">
              
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="text-lg font-bold text-white">
                  {idEditando ? 'Editando Publicação' : 'Nova Publicação'}
                </h3>
                {idEditando && (
                  <button type="button" onClick={limparFormulario} className="text-xs font-bold text-zinc-400 hover:text-white px-3 py-1 bg-zinc-800 rounded-md transition-colors">
                    Cancelar Edição
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-zinc-300">Título da Manchete *</label>
                <input 
                  type="text" required value={titulo} onChange={(e) => setTitulo(e.target.value)}
                  className="bg-zinc-950 border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-zinc-300">Subtítulo (Resumo) *</label>
                <input 
                  type="text" required value={subtitulo} onChange={(e) => setSubtitulo(e.target.value)}
                  className="bg-zinc-950 border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-zinc-300">URL da Imagem de Capa (Opcional)</label>
                <input 
                  type="url" value={imagemUrl} onChange={(e) => setImagemUrl(e.target.value)}
                  className="bg-zinc-950 border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-zinc-300">Conteúdo da Notícia *</label>
                <textarea 
                  required rows={10} value={conteudo} onChange={(e) => setConteudo(e.target.value)}
                  className="bg-zinc-950 border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors resize-y"
                />
              </div>

              {mensagem.texto && (
                <div className={`p-4 rounded-lg border font-semibold text-sm ${
                  mensagem.tipo === 'sucesso' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                  mensagem.tipo === 'info' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                  'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>
                  {mensagem.texto}
                </div>
              )}

              <div className="flex justify-end mt-2">
                <button 
                  type="submit" disabled={loading}
                  className={`font-bold py-3 px-8 rounded-lg transition-all disabled:opacity-50 flex items-center gap-2 text-zinc-950 ${idEditando ? 'bg-blue-400 hover:bg-blue-300' : 'bg-white hover:bg-zinc-200'}`}
                >
                  {loading ? 'Processando...' : idEditando ? 'Atualizar Notícia' : 'Publicar Notícia'}
                </button>
              </div>
            </form>
          </div>

          {/* COLUNA DIREITA: LISTA DE NOTÍCIAS */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-white flex items-center justify-between">
              Matérias Publicadas
              <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-1 rounded-md">{listaDeNoticias.length}</span>
            </h3>

            <div className="flex flex-col gap-3 max-h-[800px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
              {isLoading ? (
                // SKELETON DA LISTA
                [...Array(4)].map((_, i) => (
                  <div key={i} className="bg-zinc-900/50 rounded-xl p-4 border border-white/5 animate-pulse flex flex-col gap-2">
                    <div className="w-full h-4 bg-zinc-800 rounded"></div>
                    <div className="w-2/3 h-4 bg-zinc-800 rounded"></div>
                  </div>
                ))
              ) : listaDeNoticias.length === 0 ? (
                <div className="text-center py-10 bg-zinc-900/30 rounded-xl border border-dashed border-white/5">
                  <p className="text-zinc-500 text-sm">O banco de dados está vazio.</p>
                </div>
              ) : (
                listaDeNoticias.map((noticia: any) => (
                  <div key={noticia._id} className="bg-zinc-900/40 rounded-xl p-4 border border-white/5 flex flex-col gap-3 group hover:border-white/10 transition-colors">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">
                        {new Date(noticia.dataCriacao).toLocaleDateString('pt-BR')}
                      </span>
                      <h4 className="font-bold text-white text-sm line-clamp-2 leading-tight">
                        {noticia.titulo}
                      </h4>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-auto border-t border-white/5 pt-3">
                      <button 
                        onClick={() => carregarParaEdicao(noticia)}
                        className="flex-1 text-xs font-bold text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 py-2 rounded transition-colors text-center"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => handleExcluir(noticia._id)}
                        className="flex-1 text-xs font-bold text-red-500 hover:text-red-400 hover:bg-red-500/10 py-2 rounded transition-colors text-center"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}