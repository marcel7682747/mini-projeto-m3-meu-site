const listaLivros = document.getElementById("lista-livros");
const formLivro = document.getElementById("form-livro");
const inputBuscar = document.getElementById("buscar-titulo");
const btnBuscar = document.getElementById("btn-buscar");

const API_URL = "/livros";

// Mensagem de erro
function mostrarErro(msg) {
  let erroDiv = document.getElementById("mensagem-erro");
  if (!erroDiv) {
    erroDiv = document.createElement("div");
    erroDiv.id = "mensagem-erro";
    erroDiv.style.color = "#FF3B6E";
    erroDiv.style.textAlign = "center";
    erroDiv.style.marginBottom = "15px";
    erroDiv.style.fontWeight = "600";
    formLivro.before(erroDiv);
  }
  erroDiv.textContent = msg;
  setTimeout(() => {
    erroDiv.textContent = "";
  }, 3000);
}

// Listar livros (com filtro opcional)
async function listarLivros(filtroTitulo = "") {
  listaLivros.innerHTML = "";
  let url = API_URL;
  if (filtroTitulo) url += `?titulo=${encodeURIComponent(filtroTitulo)}`;

  const res = await fetch(url);
  const livros = await res.json();

  livros.forEach(livro => {
    const li = document.createElement("li");
    li.textContent = livro.autor 
      ? `${livro.titulo} - ${livro.autor}` 
      : livro.titulo;

    const btnAtualizar = document.createElement("button");
    btnAtualizar.textContent = "Atualizar";
    btnAtualizar.classList.add("btn-atualizar");
    btnAtualizar.onclick = () => atualizarLivro(livro.id);

    const btnRemover = document.createElement("button");
    btnRemover.textContent = "Remover";
    btnRemover.classList.add("btn-remover");
    btnRemover.onclick = () => removerLivro(livro.id);

    const btnVer = document.createElement("button");
    btnVer.textContent = "Ver na web";
    btnVer.classList.add("btn-ver");
    btnVer.onclick = () => {
      const query = encodeURIComponent(`${livro.titulo} livro lojas`);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    };

    li.appendChild(btnAtualizar);
    li.appendChild(btnRemover);
    li.appendChild(btnVer);

    listaLivros.appendChild(li);
  });
}

// Adicionar livro
formLivro.onsubmit = async (e) => {
  e.preventDefault();
  const titulo = document.getElementById("titulo").value.trim();
  const autor = document.getElementById("autor").value.trim();

  if (!titulo) {
    mostrarErro("Erro: O título do livro é obrigatório!");
    return;
  }

  // Verifica duplicados
  const resExist = await fetch(`${API_URL}?titulo=${encodeURIComponent(titulo)}`);
  const livrosExistentes = await resExist.json();
  if (livrosExistentes.length > 0) {
    mostrarErro("Erro: Já existe um livro com esse título!");
    return;
  }

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo, autor: autor || "" })
  });

  formLivro.reset();
  listarLivros();
};

// Remover livro
async function removerLivro(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  listarLivros();
}

// Atualizar livro
async function atualizarLivro(id) {
  const novoTitulo = prompt("Novo título:");
  const novoAutor = prompt("Novo autor (opcional):");

  if (!novoTitulo && !novoAutor) return;

  if (novoTitulo) {
    const resExist = await fetch(`${API_URL}?titulo=${encodeURIComponent(novoTitulo)}`);
    const livrosExistentes = await resExist.json();
    if (livrosExistentes.length > 0 && livrosExistentes[0].id !== id) {
      mostrarErro("Erro: Já existe um livro com esse título!");
      return;
    }
  }

  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo: novoTitulo, autor: novoAutor || "" })
  });

  listarLivros();
}

// Botão buscar livros salvos
btnBuscar.onclick = () => {
  const busca = inputBuscar.value.trim();
  listarLivros(busca); // Filtra pelos livros salvos localmente
};

// Inicializa lista completa
listarLivros();
