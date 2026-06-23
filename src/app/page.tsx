export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white font-sans">
      
      {/* Cabeçalho do Site */}
      <header className="bg-[#111827] p-4 shadow-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-emerald-400">
            CopaPortal <span className="text-sm font-normal text-gray-400 ml-2">Live</span>
          </h1>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto p-4 mt-4">
        {/* Grid divide a tela em 3 partes no PC, mas fica em 1 coluna no celular */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Coluna da Esquerda: Transmissão da CazéTV (Ocupa 2/3 da tela) */}
          <section className="lg:col-span-2 bg-[#111827] rounded-xl border border-gray-800 p-4 min-h-[400px] flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold mb-4 self-start flex items-center gap-2">
              🎥 Central de Transmissão
            </h2>
            <div className="w-full h-full bg-black rounded-lg border border-gray-700 flex items-center justify-center min-h-[400px]">
              <p className="text-gray-500">O vídeo do YouTube vai entrar aqui...</p>
            </div>
          </section>

          {/* Coluna da Direita: Placares ao Vivo (Ocupa 1/3 da tela) */}
          <section className="bg-[#111827] rounded-xl border border-gray-800 p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-emerald-400">
              ⚽ Placar Orbital Live
            </h2>
            
            {/* Botões de Filtro */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button className="bg-blue-600 text-white py-2 rounded-md font-medium text-sm">
                AO VIVO / HOJE
              </button>
              <button className="bg-gray-800 text-gray-300 py-2 rounded-md font-medium text-sm hover:bg-gray-700 transition">
                RESULTADOS
              </button>
            </div>

            {/* Espaço onde os jogos vão aparecer */}
            <div className="space-y-3">
              <p className="text-sm text-gray-500 text-center mt-10">
                Carregando jogos da API...
              </p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}