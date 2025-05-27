const SUPABASE_URL = 'https://yfnzfwpjoowwpnhhrhxx.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlmbnpmd3Bqb293d3BuaGhyaHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0MDQyMTAsImV4cCI6MjA2Mjk4MDIxMH0.DCE3VpweB5XVgiqxoqhudyIf9fNG4z26itku8c1TCk0'; // use sua chave pública real
const TABLE = 'certificados';

// Lógica de busca ao pressionar a tecla "Enter"
document.getElementById('email').addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    buscarCertificado();
  }
});

async function buscarCertificado() {
  const email = document.getElementById('email').value.trim().toLowerCase();
  if (!email || !email.includes('@')) {
    alert('Digite um e-mail válido.');
    return;
  }

  const url = `${SUPABASE_URL}/rest/v1/${TABLE}?email=eq.${email}`;

  const resp = await fetch(url, {
    headers: {
      apikey: SUPABASE_API_KEY,
      Authorization: `Bearer ${SUPABASE_API_KEY}`
    }
  });

  const dados = await resp.json();
  mostrarResultado(dados);
}

function mostrarResultado(dados) {
  const container = document.getElementById('resultado');
  container.innerHTML = '';

  if (!dados.length) {
    container.innerHTML = '<p>Nenhum certificado encontrado para este e-mail.</p>';
    return;
  }

  dados.forEach(cert => {
    const div = document.createElement('div');
    div.className = 'cert-item';
    div.innerHTML = `
      <div class="nome-evento">
      <p><strong>${cert.nome}</strong></p>
      <p>${cert.evento}</p></div>
      <div class="botao">
      <a class="btn-download" href="${cert.link_certificado}" target="_blank">Download</a></div>
    `;
    container.appendChild(div);
  });
}

// Função para alternar o menu responsivo
const navbarToggle = document.getElementById('navbar-toggle');
const navbarLinks = document.getElementById('navbar-links');

// Escuta o clique no ícone de menu (hamburger)
navbarToggle.addEventListener('click', () => {
  navbarLinks.classList.toggle('active');  // Alterna a classe "active" na lista de links
});
