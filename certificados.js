// Lógica de busca ao pressionar a tecla "Enter"
document.getElementById('campoBusca').addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    buscarCertificado();
  }
});

// Função para buscar certificados
async function buscarCertificado() {
  const busca = document.getElementById("campoBusca").value.trim();
  const tabela = document.getElementById("tabelaCertificados");
  const corpoTabela = tabela.querySelector("tbody");
  const mensagemErro = document.getElementById("mensagemErro");

  tabela.style.display = "none";  // Esconde a tabela inicialmente
  mensagemErro.textContent = "";  // Limpa qualquer mensagem de erro anterior

  // Verifica se o campo de busca está vazio
  if (!busca) {
    mensagemErro.textContent = "Por favor, digite um CPF ou e-mail.";
    return;
  }

  try {
    // Faz a requisição para o backend com o valor da busca
    const response = await fetch(`https://backend-b9do.onrender.com/certificados?query=${busca}`);
    if (!response.ok) throw new Error("Erro na requisição");
    const dados = await response.json();

    // Verifica se não encontrou dados
    if (!dados.length) {
      mensagemErro.textContent = "Nenhum certificado encontrado.";
      return;
    }

    corpoTabela.innerHTML = "";  // Limpa a tabela antes de preencher com os dados

    // Preenche a tabela com os dados recebidos
    dados.forEach(cert => {
      const row = `<tr><td>${cert.nome}</td><td>${cert.evento}</td><td><a href="${cert.link_certificado}" target="_blank">Visualizar</a></td></tr>`;
      corpoTabela.innerHTML += row;
    });

    // Exibe a tabela com os dados
    tabela.style.display = "";
  } catch (error) {
    console.error("Erro ao buscar certificados:", error);
    mensagemErro.textContent = "Erro ao buscar certificados! Verifique se o servidor está rodando.";
  }
}

// Função para alternar o menu responsivo
const navbarToggle = document.getElementById('navbar-toggle');
const navbarLinks = document.getElementById('navbar-links');

// Escuta o clique no ícone de menu (hamburger)
navbarToggle.addEventListener('click', () => {
  navbarLinks.classList.toggle('active');  // Alterna a classe "active" na lista de links
});
