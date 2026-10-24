Data: 23/10/2026 (America/Sao_Paulo). Base: commit `de7b7b1`. Branch: `audit/aquila-diagnostico-2026-10-23`. Etapa A/B: diagnóstico e proposta; nenhuma correção de aplicação autorizada nesta etapa.

# Responsividade e acessibilidade

Checagem automatizada em Chrome headless: oito rotas × nove larguras = 72 combinações. Larguras: 320, 360, 390, 430, 768, 1024, 1280, 1440 e 1920 px; altura 900 px. Nenhuma combinação apresentou scrollWidth maior que innerWidth; nenhuma imagem já carregada foi detectada quebrada. Imagens lazy fora da viewport não são inteiramente cobertas por essa checagem. Dados: [responsividade.json](evidencias/responsividade.json).

| ID | Descrição / evidência | Impacto | Prioridade | Correção proposta | Status | Resultado da validação |
|---|---|---|---|---|---|---|
| RESP-01 | 72 combinações sem overflow da raiz | Base responsiva preservada | P2 | Repetir após cada etapa visual | Verificado no escopo | 72/72 |
| RESP-02 | Painel de detalhes após a lista no layout de uma coluna, src/portfolio.css:40 | Deslocamento longo até detalhes | P1 | Revisar fluxo e retorno à lista | Proposto | Foco/Enter atual passou; usabilidade não testada com pessoas |
| RESP-03 | Captura/checagem geométrica não verifica todas as sobreposições, textos, alvos e estados | Cobertura incompleta de WCAG 2.2 AA | P2 | Revisão manual com zoom, teclado, leitor de tela, menu aberto e galerias | Pendente | Não declarar conformidade completa |

Teste existente de navegador passou em cinco larguras e verificou menu a 390 px, Escape e foco no título do detalhe. CSS contém reduced-motion e script evita observer nessa preferência. Teste de segurança com JS desativado e reduced-motion confirmou ausência de submissão do formulário. Isso não equivale a teste completo de toda navegação sem JS.

Não existem tabelas ou modais de aplicação identificados; a galeria abre imagens em nova aba. Screenshots desktop antes em evidencias/home-antes.png e portfolio-antes.png. A captura da home sem rolagem pode conter blocos ainda pendentes de IntersectionObserver, portanto não é prova de desaparecimento de conteúdo. Testes em dispositivos físicos, Safari/Firefox, paisagem e zoom ficam pendentes para fase de implementação.
