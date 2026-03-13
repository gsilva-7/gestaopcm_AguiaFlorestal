// 0. CONTROLE DE ACESSO E CARREGAMENTO
window.onload = function() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    const tipoUsuario = localStorage.getItem('tipoUsuario');

    if (!usuarioLogado) {
        window.location.href = "login/login.html";
        return;
    }

    configurarPainelPorCargo(tipoUsuario);
    carregarMaquinas(); 
};

// 1. NAVEGAÇÃO ENTRE ABAS
function openTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const target = document.getElementById(tabId);
    if (target) target.classList.add('active');
    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add('active');
    }
}

// 2. CONFIGURAÇÃO DE CARGO
function configurarPainelPorCargo(cargo) {
    const areaCriacao = document.getElementById('area-criacao-os');
    const painelStatus = document.getElementById('painel-status-adm');
    const areaCadastroMaquina = document.getElementById('area-cadastro-maquina');
    const tituloPainel = document.querySelector('.header-title h1');

    if (cargo === 'PCM') {
        if (areaCriacao) areaCriacao.style.display = 'block';
        if (painelStatus) painelStatus.style.display = 'grid';
        if (areaCadastroMaquina) areaCadastroMaquina.style.display = 'block';
        tituloPainel.innerText = "Painel de Gestão PCM (ADM)";
    } else {
        if (areaCriacao) areaCriacao.style.display = 'none';
        if (painelStatus) painelStatus.style.display = 'none';
        if (areaCadastroMaquina) areaCadastroMaquina.style.display = 'none';
        tituloPainel.innerText = "Painel de Execução - Manutentor";
    }
    carregarOrdensGerais(); 
}

// 3. ORDENS DE SERVIÇO (CONEXÃO COM PYTHON)

// FUNÇÃO NOVA: FINALIZAR O.S. NO BANCO
async function concluirOS(id) {
    if (!confirm("Deseja confirmar a conclusão?")) return;
    try {
        const response = await fetch(`http://127.0.0.1:5000/os/${id}/concluir`, { method: 'PUT' });
        if (response.ok) {
            alert("O.S. finalizada!");
            carregarOrdensGerais();
        }
    } catch (erro) { alert("Erro ao conectar com o servidor."); }
}

// FUNÇÃO NOVA: EXCLUIR O.S. DO BANCO
async function deletarOS(id) {
    if (!confirm("Deseja apagar esta O.S.?")) return;
    try {
        const response = await fetch(`http://127.0.0.1:5000/os/${id}`, { method: 'DELETE' });
        if (response.ok) {
            alert("O.S. removida!");
            carregarOrdensGerais();
        }
    } catch (erro) { alert("Erro ao conectar com o servidor."); }
}

async function gerarNovaOS(event) {
    event.preventDefault();
    const novaOS = {
        id: Date.now(),
        solicitante: document.getElementById('osSolicitante').value,
        maquina: document.getElementById('osMaquina').value,
        horimetro: document.getElementById('osHorimetro').value,
        problema: document.getElementById('osProblema').value,
        prioridade: document.getElementById('osPrioridade').value,
        data: new Date().toLocaleString('pt-BR'),
        status: "Pendente"
    };

    try {
        const response = await fetch('http://127.0.0.1:5000/os', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novaOS)
        });
        if (response.ok) {
            alert("Ordem de Serviço gravada!");
            event.target.reset();
            carregarOrdensGerais();
        }
    } catch (erro) { alert("Erro ao salvar O.S."); }
}

async function carregarOrdensGerais() {
    const container = document.getElementById('container-ordens-servico');
    const tipoUsuario = localStorage.getItem('tipoUsuario');
    try {
        const response = await fetch('http://127.0.0.1:5000/os');
        let listaOS = await response.json();
        
        atualizarContadoresADM(listaOS);

        container.innerHTML = listaOS.map(os => `
            <div class="card-os" style="border-left: 6px solid ${os.status === 'Concluída' ? '#2ecc71' : (os.prioridade === 'Alta' ? '#e74c3c' : '#40b049')}; background: rgba(255,255,255,0.05); margin-bottom: 20px; padding: 20px; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between;">
                    <h3 style="color: #40b049; margin: 0;">${os.maquina.toUpperCase()}</h3>
                    <span style="font-size: 0.75rem; color: #888;">#${os.id}</span>
                </div>
                <p><strong>Status:</strong> ${os.status}</p>
                <div style="display: flex; gap: 10px; margin-top: 15px;">
                    ${os.status !== 'Concluída' ? `<button onclick="concluirOS(${os.id})" style="flex:1; background:#2ecc71; color:white; border:none; padding:8px; border-radius:4px; cursor:pointer;">FINALIZAR</button>` : ''}
                    ${tipoUsuario === 'PCM' ? `<button onclick="deletarOS(${os.id})" style="flex:1; background:transparent; color:#e74c3c; border:1px solid #e74c3c; padding:8px; border-radius:4px; cursor:pointer;">EXCLUIR</button>` : ''}
                </div>
            </div>
        `).join('');
    } catch (erro) { container.innerHTML = "<p>Servidor Offline.</p>"; }
}

function atualizarContadoresADM(lista) {
    if(!document.getElementById('count-pendente')) return;
    document.getElementById('count-pendente').innerText = lista.filter(os => os.status === "Pendente").length;
    document.getElementById('count-execucao').innerText = lista.filter(os => os.status === "Em Execução").length;
    document.getElementById('count-concluida').innerText = lista.filter(os => os.status === "Concluída").length;
}

// 4. GESTÃO DE FROTA E LOGOUT
async function carregarMaquinas() {
    try {
        const response = await fetch("http://127.0.0.1:5000/maquinas");
        const maquinas = await response.json();
        // Lógica para listar máquinas se necessário
    } catch (e) { console.log("Erro ao carregar máquinas."); }
}

async function cadastrarNovaMaquina(event) {
    event.preventDefault();
    const novaMaquina = { 
        id: document.getElementById('newIdMaquina').value, 
        nome: document.getElementById('newNomeMaquina').value 
    };

    try {
        const response = await fetch("http://127.0.0.1:5000/maquinas", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novaMaquina)
        });
        if (response.ok) {
            alert("Máquina cadastrada!");
            event.target.reset();
            carregarMaquinas();
        }
    } catch (erro) { alert("Erro ao cadastrar máquina."); }
}

function fazerLogout() { 
    if (confirm("Deseja realmente sair?")) { 
        localStorage.removeItem('usuarioLogado'); 
        localStorage.removeItem('tipoUsuario'); 
        window.location.href = "login/login.html"; 
    } 
}