# Diário de Bordo

Registro de atividades do dia. O usuário cria uma entrada com título, descrição e data, vê a lista e pode remover. Tudo fica no navegador (`localStorage`), funciona offline e pode ser instalado na tela inicial.

Exercício de Progressive Web App do curso de Java Full Stack da EBAC.

## Site

https://lupiran.github.io/diario-de-bordo/

O endereço passa a responder depois do primeiro deploy na branch `main`. Em **Settings → Pages**, a origem precisa estar em **GitHub Actions**.

## Como rodar

O service worker não funciona se o arquivo for aberto direto do disco. Sirva a pasta por HTTP:

```bash
npx serve .
```

Abre em `http://localhost:3000`.

## O que a entrega inclui

| Arquivo | Função |
| --- | --- |
| `index.html` | Estrutura da página |
| `style.css` | Interface responsiva |
| `script.js` | CRUD, `localStorage`, toasts e instalação |
| `manifest.json` | Nome, cores, `start_url`, `display` e ícones |
| `service-worker.js` | Cache para uso offline |
| `icons/` | Ícones 192×192 e 512×512 |

## Interface

O exercício pede HTML, CSS e JavaScript separados, sem framework. A interface segue três referências nesse código:

- **shadcn/ui** — tokens de cor, raio, cartão, campo, botão e tema claro/escuro
- **react-icons** — ícones Feather (`FiBookOpen`, `FiPlus`, `FiTrash2`, `FiCalendar` e os demais), desenhados em SVG
- **toasts** — avisos com título, descrição, variante e ação (registrar, validar, remover, desfazer, ficar offline), no padrão do Sonner

A fonte é a Geist, a mesma família usada no shadcn. O arquivo está em `fonts/` (licença SIL OFL, `fonts/OFL.txt`) para a tela continuar igual sem internet.

## Conferir a PWA

1. Abra o site publicado, ou o endereço local servido por HTTP.
2. No Chrome, DevTools → **Lighthouse** → categoria **Progressive Web App**.
3. Recarregue a página uma vez para o service worker assumir o controle.
4. Em DevTools → **Network**, marque **Offline** e recarregue: a tela e as entradas continuam.
5. O botão **Instalar** aparece quando o Chrome dispara `beforeinstallprompt`.

## Publicação

O workflow em [`.github/workflows/pages.yml`](.github/workflows/pages.yml) publica esta pasta no GitHub Pages a cada push na `main`. O token é o `GITHUB_TOKEN` automático do Actions. Não cadastre outro secret com esse nome.
