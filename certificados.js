const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzXUW3N0nwPcIeLGg0HQgUlnwZuReN6ZfTKtvDAKCbEy84dZS6r8l07DC4m2Wr8MfGEfA/exec';

const mensagensLoading = [
  "Consultando os arquivos...",
  "Revirando as gavetas...",
  "Soprando a poeira dos documentos...",
  "Encontrei alguns certificados aqui, só conferindo se tem mais...",
  "Parece que tem alguma coisa aqui!",
  "Quase pronto...",
  "Ajustes finais..."
];

let intervaloMsg;
let certificadosParaBaixar = [];

document.getElementById('email').addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    buscarCertificado();
  }
});

async function buscarCertificado() {
  const emailInput = document.getElementById('email');
  const email = emailInput.value.trim().toLowerCase();
  
  const container = document.getElementById('resultado');
  const loadingArea = document.getElementById('loading-area');
  const msgElement = document.getElementById('loading-msg');

  if (!email || !email.includes('@')) {
    alert('Por favor, digite um e-mail válido.');
    return;
  }

  container.innerHTML = '';
  loadingArea.style.display = 'block';
  emailInput.disabled = true;
  
  let msgIndex = 0;
  msgElement.innerText = mensagensLoading[0];
  
  intervaloMsg = setInterval(() => {
    msgIndex++;
    if (msgIndex < mensagensLoading.length) {
        msgElement.innerText = mensagensLoading[msgIndex];
    }
  }, 2500);

  try {
    const response = await fetch(`${APPS_SCRIPT_URL}?email=${encodeURIComponent(email)}`);
    
    if (!response.ok) {
      throw new Error('Erro na conexão com a planilha.');
    }

    const dados = await response.json();
    
    pararLoading();
    mostrarResultado(dados);

  } catch (error) {
    console.error(error);
    pararLoading();
    container.innerHTML = '<p style="color: red;">Ocorreu um erro ao buscar. Tente novamente.</p>';
  } finally {
    emailInput.disabled = false;
    emailInput.focus();
  }
}

function pararLoading() {
  clearInterval(intervaloMsg);
  document.getElementById('loading-area').style.display = 'none';
}

function mostrarResultado(dados) {
  const container = document.getElementById('resultado');
  container.innerHTML = '';

  if (!dados || dados.length === 0 || dados.erro) {
    container.innerHTML = '<p>Nenhum certificado encontrado para este e-mail. Verifique a digitação.</p>';
    return;
  }

  if (dados.length > 1) {
    const btnAll = document.createElement('button');
    btnAll.innerText = `Baixar Todos (${dados.length})`;
    btnAll.className = 'btn-baixar-tudo';
    
    btnAll.onclick = () => abrirModalDownload(dados);
    
    container.appendChild(btnAll);
  }

  dados.forEach(cert => {
    const div = document.createElement('div');
    div.className = 'cert-item';
    
    div.innerHTML = `
      <div class="nome-evento">
        <p><strong>${cert.nome}</strong></p>
        <p>${cert.evento}</p>
      </div>
      <div class="botao">
        <a class="btn-download" href="${cert.link_certificado}" target="_blank">Download</a>
      </div>
    `;
    
    div.style.opacity = 0;
    container.appendChild(div);
    
    requestAnimationFrame(() => {
        div.style.transition = "opacity 0.5s ease";
        div.style.opacity = 1;
    });
  });
}

function abrirModalDownload(dados) {
    certificadosParaBaixar = dados;
    document.getElementById('qtd-certs').innerText = dados.length;
    document.getElementById('modal-aviso').style.display = 'flex';
}

function fecharModal() {
    document.getElementById('modal-aviso').style.display = 'none';
}

function executarDownloadEmMassa() {
    fecharModal();

    certificadosParaBaixar.forEach((cert, index) => {
        setTimeout(() => {
            window.open(cert.link_certificado, '_blank');
        }, index * 1000); 
    });
}

window.onclick = function(event) {
    const modal = document.getElementById('modal-aviso');
    if (event.target == modal) {
        fecharModal();
    }
}

const navbarToggle = document.getElementById('navbar-toggle');
const navbarLinks = document.getElementById('navbar-links');

if (navbarToggle) {
    navbarToggle.addEventListener('click', () => {
        navbarToggle.classList.toggle('active');
        navbarLinks.classList.toggle('active');
    });
}
