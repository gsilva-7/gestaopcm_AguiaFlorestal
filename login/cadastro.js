document.getElementById('cadastroForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Captura os dados usando os IDs que adicionamos ao formulário [cite: 7]
    const nome = document.getElementById('cad-nome').value;
    const matricula = document.getElementById('cad-matricula').value;
    const funcao = document.getElementById('cad-funcao').value;
    const senha = document.getElementById('cad-senha').value;

    // Criamos um objeto para o novo usuário
    const novoUsuario = {
        nome: nome,
        matricula: matricula,
        funcao: funcao,
        senha: senha
    };

    // Buscamos a lista de usuários já cadastrados no navegador (ou criamos uma vazia) [cite: 7]
    let usuarios = JSON.parse(localStorage.getItem('usuarios_aguia')) || [];
    
    // Verificamos se a matrícula já existe para evitar duplicidade
    const existe = usuarios.find(u => u.matricula === matricula);
    
    if (existe) {
        alert("Esta matrícula já está cadastrada no sistema!");
        return;
    }

    // Adicionamos o novo funcionário à lista (ex: Funcionário 1, Funcionário 2) [cite: 7]
    usuarios.push(novoUsuario);
    
    // Salvamos de volta no banco local (localStorage) 
    localStorage.setItem('usuarios_aguia', JSON.stringify(usuarios));

    alert(`Solicitação de cadastro para ${nome} enviada com sucesso!`);
    
    // Redireciona para o login (ajustado para entrar na pasta login)
    window.location.href = 'login.html';
});