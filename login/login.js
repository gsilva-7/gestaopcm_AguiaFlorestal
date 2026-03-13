let cargoSelecionado = 'PCM';

function selectRole(role) {
    cargoSelecionado = role;
    document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    // URL COMPLETA para evitar o erro 404
    fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            usuario: user, 
            senha: pass, 
            cargo: cargoSelecionado 
        })
    })
    .then(res => {
        if (!res.ok) throw new Error('Credenciais incorretas');
        return res.json();
    })
    .then(data => {
        if (data.sucesso) {
            // Nomes exatos que o seu script.js espera encontrar
            localStorage.setItem('usuarioLogado', data.nome);
            localStorage.setItem('tipoUsuario', data.cargo);
            window.location.href = '../index.html';
        }
    })
    .catch(err => alert(err.message));
});