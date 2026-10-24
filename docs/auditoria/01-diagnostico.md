Data: 23/10/2026 (America/Sao_Paulo). Base: commit `de7b7b1`. Branch: `audit/aquila-diagnostico-2026-10-23`. Etapa A/B: diagnóstico e proposta; nenhuma correção de aplicação autorizada nesta etapa.

# Diagnóstico inicial

## Escopo e arquitetura confirmada

67 arquivos versionados; 5.959.826 bytes, incluindo documentação e testes. Inventário de páginas, recursos, tamanhos e referências: [inventario.json](evidencias/inventario.json). Não há AGENTS.md encontrado na árvore pesquisada.

Oito páginas: `/` (index.html), `/portfolio/`, `/pdv.html`, `/FAQ.html`, `/blog.html`, `/privacidade.html`, `/termos.html`, `/lgpd.html`. HTML estático multipágina; não há React, Vue, Angular, package.json ou lockfile. Dois CSS (`styles.css`, `src/portfolio.css`), três JS (`src/js/main.js`, `portfolio-core.js`, `portfolio.js`) e catálogo `src/data/projects.json`. Sem servidor de aplicação, API própria, autenticação ou Pages Functions identificados.

`main.js` compartilha menu, revelação de conteúdo, formulário e ano do rodapé. O core do portfólio valida dados/URLs e implementa filtros; a interface cria elementos DOM com textContent. O catálogo contém seis entradas: um produto PDV, o site da empresa e quatro modelos demonstrativos. Não são seis entregas comprovadas a clientes.

`python3 scripts/build.py` chama o renderizador do catálogo e copia HTML/CSS/robots/sitemap/src/portfolio para dist. Python com biblioteca padrão; nenhum build JS necessário. Atenção: o renderizador escreve no HTML fonte. A auditoria não executou esse build na árvore de trabalho; sua validação será feita em cópia temporária.

Recursos: PNG, SVG e dois arquivos de imagem sem extensão (home/login do PDV); capturas reais presentes em portfolio/img. Logos preto/branco e favicon existentes. Google Fonts Inter (400–800, display=swap) e Bootstrap Icons 1.11.3 via jsDelivr são dependências de rede. Sem scripts externos de aplicação encontrados. Links externos para WhatsApp, e-mail, LinkedIn e GitHub; somente fetch local do catálogo. Formulário prepara URL wa.me, sem endpoint próprio.

Testes: Node nativo, Python unittest, dois scripts Playwright. Playwright e Lighthouse instalados exclusivamente em /tmp/aquila-audit-tools para inspeção; nenhum manifesto ou dependência acrescentado ao projeto.

## Registro de problemas

| ID | Descrição e evidência | Impacto | Prioridade | Correção proposta | Status | Validação |
|---|---|---|---|---|---|---|
| ARQ-01 | CSS com overrides tardios, styles.css:823–874; regras anteriores de .hero, .btn e .card | Manutenção e regressão visual | P2 | Consolidar por componente conservando cascata efetiva | Proposto | Inspeção estática |
| ARQ-02 | Cabeçalho/rodapé e CSP repetidos nas oito páginas | Divergência de conteúdo/configuração | P2 | Checklist e verificações comuns; não introduzir framework | Proposto | Oito HTML inspecionados |
| ARQ-03 | build.py:9–15 reutiliza dist sem remover arquivos antigos | Possível resíduo em builds incrementais | P2 | Empacotamento em diretório temporário limpo; preservar fonte | Proposto; risco condicional | Código confirmado; resíduo não observado em produção |
| COM-01 | index.html:266 e main.js:76 apontam para números diferentes | Contato incorreto e risco de encaminhar dados ao destinatário errado | P1 | Confirmar titularidade e padronizar contatos/JSON-LD | Depende de decisão comercial | Divergência confirmada; nenhum envio realizado |

Não há evidência suficiente para excluir arquivos como obsoletos. Logo preto e capturas não exibidas em todas as rotas não devem ser apagados. `dist/` e caches Python são ignorados; tamanho local com dist duplicado não equivale a payload transferido. Segurança, performance e experiência detalhadas nos relatórios seguintes.
