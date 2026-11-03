/* Diário de Bordo — CRUD no navegador, sem framework.
   Visual: tokens e componentes no padrão do shadcn/ui.
   Ícones: Feather, o mesmo conjunto do react-icons/fi.
   Avisos: toasts com título, descrição, variante e ação, no padrão do Sonner. */

const CHAVE_ENTRADAS = "diario-de-bordo.entradas";
const CHAVE_TEMA = "diario-de-bordo.tema";

const ICONES = {
  "book-open":
    '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>',
  "trash-2":
    '<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>',
  calendar:
    '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>',
  download:
    '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>',
  wifi: '<path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line>',
  "wifi-off":
    '<line x1="1" y1="1" x2="23" y2="23"></line><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path><path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line>',
  sun: '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>',
  moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>',
  "check-circle":
    '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>',
  "alert-triangle":
    '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>',
  info: '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>',
  x: '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>',
};

const form = document.querySelector("#form-entrada");
const campoTitulo = document.querySelector("#titulo");
const campoDescricao = document.querySelector("#descricao");
const campoData = document.querySelector("#data");
const lista = document.querySelector("#lista");
const contador = document.querySelector("#contador");
const toaster = document.querySelector("#toaster");
const botaoInstalar = document.querySelector("#instalar");
const botaoTema = document.querySelector("#tema");
const rede = document.querySelector("#rede");
const redeTexto = document.querySelector("#rede-texto");

let eventoInstalar = null;

pintarIcones(document);

campoData.value = hojeISO();
aplicarTema(temaInicial());
atualizarRede();
renderizar();
registrarServiceWorker();
prepararInstalacao();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const titulo = campoTitulo.value.trim();
  const descricao = campoDescricao.value.trim();
  const data = campoData.value;

  limparInvalidos();

  if (!titulo) {
    invalidar(campoTitulo);
    toast({ title: "Informe o título", variant: "warning" });
    campoTitulo.focus();
    return;
  }

  if (!descricao) {
    invalidar(campoDescricao);
    toast({ title: "Informe a descrição", variant: "warning" });
    campoDescricao.focus();
    return;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    invalidar(campoData);
    toast({ title: "Informe uma data válida", variant: "warning" });
    campoData.focus();
    return;
  }

  const entradas = lerEntradas();
  entradas.push({
    id: novoId(),
    titulo,
    descricao,
    data,
    criadoEm: new Date().toISOString(),
  });
  salvarEntradas(entradas);
  form.reset();
  campoData.value = data;
  renderizar();
  toast({
    title: "Entrada registrada",
    description: titulo,
    variant: "success",
  });
  campoTitulo.focus();
});

botaoTema.addEventListener("click", () => {
  const escuro = document.documentElement.classList.contains("dark");
  aplicarTema(escuro ? "light" : "dark");
});

window.addEventListener("online", () => {
  atualizarRede();
  toast({ title: "Conexão restabelecida", variant: "success" });
});

window.addEventListener("offline", () => {
  atualizarRede();
  toast({
    title: "Você está offline",
    description: "As entradas continuam salvas neste aparelho.",
    variant: "warning",
  });
});

function lerEntradas() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE_ENTRADAS) || "[]");
    if (!Array.isArray(dados)) return [];
    return dados.filter((entrada) => entrada && typeof entrada.titulo === "string" && entrada.id);
  } catch {
    return [];
  }
}

function salvarEntradas(entradas) {
  localStorage.setItem(CHAVE_ENTRADAS, JSON.stringify(entradas));
}

function ordenar(entradas) {
  return [...entradas].sort((a, b) => {
    if (a.data !== b.data) return a.data < b.data ? 1 : -1;
    if (a.criadoEm !== b.criadoEm) return a.criadoEm < b.criadoEm ? 1 : -1;
    return 0;
  });
}

function renderizar() {
  const entradas = ordenar(lerEntradas());
  contador.textContent = textoContagem(entradas.length);
  lista.replaceChildren();

  if (entradas.length === 0) {
    lista.append(estadoVazio());
    return;
  }

  entradas.forEach((entrada) => lista.append(cartaoEntrada(entrada)));
}

function estadoVazio() {
  const bloco = document.createElement("div");
  bloco.className = "vazio";

  const icone = document.createElement("div");
  icone.className = "vazio-icone";
  icone.innerHTML = svg("book-open");

  const titulo = document.createElement("strong");
  titulo.textContent = "Nenhuma entrada ainda";

  const texto = document.createElement("p");
  texto.textContent = "Registre a primeira atividade do dia.";

  bloco.append(icone, titulo, texto);
  return bloco;
}

function cartaoEntrada(entrada) {
  const artigo = document.createElement("article");
  artigo.className = "entrada";

  const topo = document.createElement("div");
  topo.className = "entrada-topo";

  const titulo = document.createElement("h3");
  titulo.textContent = entrada.titulo;

  const remover = document.createElement("button");
  remover.type = "button";
  remover.className = "btn btn-fantasma btn-icone btn-remover";
  remover.setAttribute("aria-label", `Remover entrada ${entrada.titulo}`);
  remover.innerHTML = svg("trash-2");
  remover.addEventListener("click", () => removerEntrada(entrada.id));

  const data = document.createElement("p");
  data.className = "entrada-data";
  data.innerHTML = svg("calendar");
  const dataTexto = document.createElement("span");
  dataTexto.textContent = formatarData(entrada.data);
  data.append(dataTexto);

  const descricao = document.createElement("p");
  descricao.className = "entrada-descricao";
  descricao.textContent = entrada.descricao;

  topo.append(titulo, remover);
  artigo.append(topo, data, descricao);
  return artigo;
}

function removerEntrada(id) {
  const entradas = lerEntradas();
  const removida = entradas.find((entrada) => entrada.id === id);
  if (!removida) return;

  salvarEntradas(entradas.filter((entrada) => entrada.id !== id));
  renderizar();

  toast({
    title: "Entrada removida",
    description: removida.titulo,
    action: {
      label: "Desfazer",
      onClick: () => {
        const atuais = lerEntradas();
        if (!atuais.some((entrada) => entrada.id === removida.id)) {
          atuais.push(removida);
          salvarEntradas(atuais);
          renderizar();
        }
        toast({ title: "Remoção desfeita", variant: "success" });
      },
    },
  });
}

function textoContagem(total) {
  if (total === 0) return "Nenhuma entrada";
  if (total === 1) return "1 entrada";
  return `${total} entradas`;
}

function formatarData(iso) {
  const [ano, mes, dia] = iso.split("-").map(Number);
  if (!ano || !mes || !dia) return iso;
  return new Date(ano, mes - 1, dia).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function hojeISO() {
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  return `${agora.getFullYear()}-${mes}-${dia}`;
}

function novoId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function invalidar(campo) {
  campo.setAttribute("aria-invalid", "true");
}

function limparInvalidos() {
  [campoTitulo, campoDescricao, campoData].forEach((campo) => campo.removeAttribute("aria-invalid"));
}

function toast({ title, description, variant = "default", action, duration = 4200 }) {
  const item = document.createElement("div");
  item.className = `toast toast-${variant}`;

  const icone = document.createElement("span");
  icone.className = "toast-icone";
  icone.innerHTML = svg(iconeDoToast(variant));

  const texto = document.createElement("div");
  const titulo = document.createElement("p");
  titulo.className = "toast-titulo";
  titulo.textContent = title;
  texto.append(titulo);

  if (description) {
    const descricao = document.createElement("p");
    descricao.className = "toast-descricao";
    descricao.textContent = description;
    texto.append(descricao);
  }

  const fechar = document.createElement("button");
  fechar.type = "button";
  fechar.className = "toast-fechar";
  fechar.setAttribute("aria-label", "Fechar notificação");
  fechar.innerHTML = svg("x");

  item.append(icone, texto, fechar);

  let timer = window.setTimeout(encerrar, duration);
  const pausar = () => window.clearTimeout(timer);
  const retomar = () => {
    timer = window.setTimeout(encerrar, 1600);
  };

  if (action) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "toast-acao";
    botao.textContent = action.label;
    botao.addEventListener("click", () => {
      pausar();
      action.onClick();
      encerrar();
    });
    texto.append(botao);
  }

  fechar.addEventListener("click", encerrar);
  item.addEventListener("mouseenter", pausar);
  item.addEventListener("mouseleave", retomar);
  item.addEventListener("focusin", pausar);
  item.addEventListener("focusout", retomar);

  toaster.append(item);
  while (toaster.children.length > 3) toaster.firstElementChild.remove();

  function encerrar() {
    pausar();
    if (!item.isConnected || item.classList.contains("saindo")) return;
    item.classList.add("saindo");
    item.addEventListener("animationend", () => item.remove(), { once: true });
    window.setTimeout(() => item.remove(), 200);
  }
}

function iconeDoToast(variant) {
  if (variant === "success") return "check-circle";
  if (variant === "warning" || variant === "destructive") return "alert-triangle";
  return "info";
}

function svg(nome) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONES[nome] || ""}</svg>`;
}

function pintarIcones(raiz) {
  raiz.querySelectorAll("[data-icone]").forEach((elemento) => {
    elemento.innerHTML = svg(elemento.dataset.icone);
  });
}

function temaInicial() {
  const salvo = localStorage.getItem(CHAVE_TEMA);
  if (salvo === "dark" || salvo === "light") return salvo;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function aplicarTema(tema) {
  const escuro = tema === "dark";
  document.documentElement.classList.toggle("dark", escuro);
  localStorage.setItem(CHAVE_TEMA, tema);

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = escuro ? "#0a0a0a" : "#171717";

  const icone = botaoTema.querySelector("[data-icone]");
  icone.dataset.icone = escuro ? "sun" : "moon";
  icone.innerHTML = svg(icone.dataset.icone);
  botaoTema.setAttribute("aria-label", escuro ? "Usar tema claro" : "Usar tema escuro");
}

function atualizarRede() {
  const offline = !navigator.onLine;
  rede.classList.toggle("badge-offline", offline);
  redeTexto.textContent = offline ? "Offline" : "Online";
  const icone = rede.querySelector("[data-icone]");
  icone.dataset.icone = offline ? "wifi-off" : "wifi";
  icone.innerHTML = svg(icone.dataset.icone);
}

function prepararInstalacao() {
  if (window.matchMedia("(display-mode: standalone)").matches) {
    botaoInstalar.hidden = true;
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    eventoInstalar = event;
    botaoInstalar.hidden = false;
  });

  botaoInstalar.addEventListener("click", async () => {
    if (!eventoInstalar) return;
    eventoInstalar.prompt();
    const escolha = await eventoInstalar.userChoice;
    eventoInstalar = null;
    botaoInstalar.hidden = true;
    if (escolha.outcome === "accepted") {
      toast({ title: "Instalação iniciada", variant: "success" });
    }
  });

  window.addEventListener("appinstalled", () => {
    eventoInstalar = null;
    botaoInstalar.hidden = true;
    toast({ title: "Diário instalado neste aparelho", variant: "success" });
  });
}

function registrarServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  navigator.serviceWorker.register("./service-worker.js").catch(() => {
    toast({
      title: "Não foi possível ativar o modo offline",
      variant: "destructive",
    });
  });
}
