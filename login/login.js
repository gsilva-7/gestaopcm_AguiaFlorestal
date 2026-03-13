let selectedRole = 'PCM';

function selectRole(role) {
    selectedRole = role;
    document.querySelectorAll('.role-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-role') === role) btn.classList.add('active');
    });
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === "admin" && password === "adm123") {
        // Guarda exatamente o que o script.js vai procurar
        localStorage.setItem('usuarioLogado', username);
        localStorage.setItem('tipoUsuario', selectedRole);
        
        window.location.href = '../index.html'; // Verifique se este caminho está correto!
    } else {
        alert("Acesso negado! Use admin / adm123");
    }
});