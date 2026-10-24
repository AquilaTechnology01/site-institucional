# Relatório — Aquila Executive Portfolio

> Atualização posterior: o responsável confirmou que o Chatbot Inteligente está pronto. Seu status atual é **Disponível**. As duas imagens fornecidas em `portfolio/img/Chatbot/` foram incluídas como ilustrações na home, na vitrine e na galeria, com versões WebP responsivas. Não são apresentadas como capturas verificadas do produto. Não foram presumidos recursos bancários, preços ou integrações a partir do texto das imagens. O filtro “Em desenvolvimento” permanece suportado no código, mas fica oculto enquanto não houver entradas nesse estágio. Os registros abaixo descrevem a implementação inicial; esta nota registra o estado atual do chatbot.

Implementação de 24/10/2026, exclusivamente para a apresentação do portfólio e os recursos compartilhados necessários ao catálogo. Nenhum push, merge ou deploy executado.

## Análise inicial e restauração

A rota `/portfolio/` usa `portfolio/index.html`, os estilos globais de `styles.css`, `src/portfolio.css`, os scripts `src/js/portfolio-core.js` e `src/js/portfolio.js`, o catálogo `src/data/projects.json` e o renderizador sem JavaScript `scripts/render_portfolio.py`. O build existente mantém a saída em `dist/` e os bundles com hash.

Foi criado o checkpoint Git **`36d8637`** (`chore: checkpoint homepage redesign before executive portfolio`) antes de modificar o portfólio, preservando também as alterações anteriores da home. Branch: `audit/aquila-diagnostico-2026-10-23`.

O catálogo original continha seis entradas: Aquila PDV, Site institucional Aquila, Modelo de site institucional, Cardápio digital, Landing page de advocacia e Landing page de padaria. Todas foram preservadas integralmente no JSON. Capturas WebP e miniaturas reais já existentes foram reutilizadas; as galerias e seus caminhos públicos continuam disponíveis.

## Componentes e melhorias

- **Abertura editorial:** texto e botão à esquerda; composição com capturas reais do PDV e do modelo de padaria à direita. Sem carrossel automático. A expressão “novas possibilidades” mantém o azul corporativo.
- **Vitrine assimétrica:** reaproveita os estilos aprovados da vitrine da home, sem alterar `index.html` ou `styles.css`. PDV destacado e funcionalidades verificadas; chatbot identificado como em desenvolvimento; sites/landing pages demonstrativos; automações como serviço sob medida.
- **Galeria:** oito entradas, busca e cinco filtros acessíveis: Todos, Sistemas, Websites, Automações e Em desenvolvimento. O último filtra o status, independentemente da categoria. Mantém seleção por teclado, estado vazio, erro de carregamento e retry.
- **Painel de detalhes:** preserva problema, solução, funcionalidades, tecnologias, links e galerias. Agora aparece abaixo da galeria com mais espaço. Ao selecionar um projeto, o título recebe foco e o painel é trazido à área visível. Acrescentada chamada ao contato existente.
- **Diferenciais:** soluções personalizadas, tecnologia aplicada e foco em resultados, sem estatísticas ou promessas quantitativas.
- **Chamada comercial:** fundo azul profundo, links para orçamento e serviços existentes, sem novos formulários.
- **Interações:** entrada finita de 500 ms por Intersection Observer, hover de 300 ms e zoom máximo de 1,03. Conteúdo visível por padrão; foco encerra a animação do card. Movimento reduzido desativa as animações.
- **Renderização sem JavaScript:** catálogo completo com categoria, status, tecnologias documentadas ou nota de indisponibilidade, descrição e links reais. Filtros ficam ocultos nesse modo.

### Novas entradas, com escopo explícito

O chatbot e as automações já estavam descritos na home. Foram acrescentados ao catálogo como **iniciativa em desenvolvimento** e **serviço sob medida**, respectivamente; não são apresentados como cases de clientes ou novos produtos finalizados.

As duas ilustrações SVG originais são conceituais e seus textos alternativos deixam isso explícito. Não simulam interfaces ou funcionalidades implementadas. Python é informado porque está documentado na oferta de automações; o stack do chatbot não foi presumido. Os stacks não documentados dos demais projetos continuam identificados como não divulgados.

## Arquivos modificados/criados nesta etapa

| Arquivo | Alteração |
|---|---|
| `portfolio/index.html` | Abertura, vitrine, galeria, diferenciais e chamada comercial |
| `src/portfolio.css` | Layout e estilos exclusivos da rota |
| `src/js/portfolio-core.js` | Separação entre categorias válidas e filtro de estágio |
| `src/js/portfolio.js` | Cards, painel, filtros e animações progressivas |
| `src/data/projects.json` | Duas entradas documentadas; seis originais preservadas |
| `scripts/render_portfolio.py` | Metadados e destinos corretos no catálogo estático |
| `src/img/portfolio/chatbot.svg` | Ilustração conceitual original |
| `src/img/portfolio/python.svg` | Ilustração conceitual original |
| `tests/executive-portfolio.browser.cjs` | Novas verificações do portfólio executivo |
| `tests/portfolio.test.cjs` | Contagem e filtros do catálogo ampliado |
| `tests/portfolio.browser.cjs` | Expectativa de oito entradas |
| `tests/build_test.py` | Expectativa de oito entradas |
| `tests/consent.browser.cjs` | Preservação do catálogo com oito entradas |
| `tests/optimization.browser.cjs` | Fallback sem JS com oito entradas |
| `RELATORIO_PORTFOLIO_EXECUTIVO.md` | Este relatório |

## Testes executados

- Build estático concluído, com validação de referências locais e sem modificar as fontes.
- 5 testes Python de build: determinismo, integridade de hashes, limpeza da saída e preservação da saída anterior quando há falha e bloqueio de navegação insegura no catálogo estático.
- 8 testes unitários do catálogo: filtros, busca, validação de dados, caminhos de imagens, URLs perigosas, projetos privados e variantes responsivas.
- 2 testes SEO nas fontes e 2 em `dist/`: oito rotas, canonical, metadados, títulos, sitemap e catálogo estático.
- Teste existente do portfólio: rota direta, recarga, busca, teclado/foco, categorias, demonstração indisponível, estado vazio, erro/retry, dados inválidos, menus e sete outras páginas.
- Novo teste executivo: cinco filtros; oito entradas; teclado; detalhes das novas iniciativas; galeria real com três imagens; imagens e links locais; cards e overflow em **320, 375, 390, 430, 768, 1024, 1366, 1440 e 1920 px**; axe no conteúdo em desktop/celular; movimento reduzido e fallback sem JavaScript.
- Auditoria geral: **72 combinações de página/largura**, 144 verificações de logos, fallback PNG, menus/Escape/foco, imagens, formulário simulado e axe em oito páginas e dois diálogos. Zero erros JS e zero respostas locais inválidas.
- 16 comparações de estilos entre fontes e build, incluindo popup, menus, conteúdo e erros do formulário.
- Consentimento: decisões, recargas, oito rotas, revogação, expiração, foco, teclado, rejeição sem afetar o catálogo e armazenamento bloqueado.
- Segurança: oito páginas sem violações CSP, script inline bloqueado e formulário sem JavaScript sem transmissão de dados.
- `node --check` nos scripts alterados e `git diff --check`.

Axe complementa as verificações de teclado, sem substituir uma auditoria manual completa com todos os leitores de tela. Nenhum dado real foi transmitido pelo formulário durante os testes.

## Desempenho local

Lighthouse mobile, uma execução local após a implementação: desempenho **99**, LCP **2.11 s**, CLS **0**, TBT **0 ms**. São resultados de laboratório, sujeitos à variação do ambiente; não representam medição da hospedagem, INP de campo ou garantia de produção. A imagem principal não recebe animação de entrada para priorizar seu aparecimento. Imagens abaixo da abertura usam lazy loading; variantes WebP existentes e a prioridade de carregamento da captura principal foram reutilizadas.

## Preservação verificada

Comparação de SHA-256 confirmou que `index.html`, `styles.css`, scripts globais, slider da home, formulário, consentimento, estilos de cookies e `_headers` não foram alterados nesta etapa. O HTML anterior ao `<main>` e posterior ao seu fechamento no portfólio permaneceu idêntico, preservando cabeçalho, logotipos, rodapé, CSP e diálogos.

Os seis objetos originais do catálogo foram comparados com o checkpoint e permanecem idênticos. Não houve remoção de arquivos, alteração de URLs públicas, novas integrações ou mudança de configuração do Cloudflare Pages.

## Problemas encontrados e pendências

- O catálogo anterior não incluía as duas iniciativas exigidas para a nova vitrine. Elas foram documentadas com base na home, sem inventar cases, clientes ou resultados.
- Não existem capturas reais do chatbot ou de automações implementadas no repositório. São usadas ilustrações conceituais identificadas; substituir por capturas somente quando existirem evidências reais.
- Os stacks de vários modelos e do PDV não estão publicados no catálogo. Foram mantidos como não divulgados.
- O desenho específico mencionado como “esboço aprovado” não veio anexado nesta solicitação. A composição segue as instruções textuais e a linguagem visual já aprovada na sessão.
- As capturas existentes retratam as versões documentadas dos projetos; a imagem histórica do site institucional não foi substituída por uma interface inventada.
- Sem bloqueios técnicos identificados nos testes executados. As limitações de conteúdo acima permanecem explícitas na página.

## Como revisar e publicar

```bash
python3 scripts/build.py
python3 -m http.server 4181 --bind 127.0.0.1 --directory dist
```

Abrir `http://127.0.0.1:4181/portfolio/`. Para testar, utilizar os comandos descritos acima e `SITE_BASE=http://127.0.0.1:4181 node tests/executive-portfolio.browser.cjs`, com Playwright/Chrome/axe disponíveis no ambiente de desenvolvimento.

Revisar o diff contra `36d8637`, criar o commit da implementação e enviar a branch somente após autorização. Publicar pelo fluxo existente do repositório/Cloudflare Pages, revisando a branch e as configurações de preview/produção já existentes. Não é necessário mudar DNS, credenciais ou integrações. Este trabalho não executou nenhuma publicação.
