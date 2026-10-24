Data: 23/10/2026 (America/Sao_Paulo). Base: commit `de7b7b1`. Branch: `audit/aquila-diagnostico-2026-10-23`. Etapa A/B: diagnóstico e proposta; nenhuma correção de aplicação autorizada nesta etapa.

# Plano de implementação para aprovação

Diagnóstico concluído dentro dos limites documentados. A implementação depende da aprovação solicitada expressamente no pedido. Nenhuma mudança de produção está incluída na aprovação das etapas locais.

| Etapa / IDs | O que e por quê | Arquivos previstos | Risco | Validação / aceite |
|---|---|---|---|---|
| 1 — COM-01, SEG-01/03/04, SEO-02 | Confirmar contato/grafia; alinhar links, formulário e entidade; aviso contextual e limites de campos | index.html, páginas com contato, src/js/main.js | Escolher número errado; CSP/hash divergente | Dados comerciais confirmados; simular abertura sem enviar; CSP/SEO passam |
| 2 — PERF-01/02, ARQ-01 | Comprimir imagens em formatos modernos mantendo originais; dimensões e srcset/sizes quando adequados; CSS consolidado | styles.css, src/portfolio.css, HTML, ativos derivados e catálogo | Corte de capturas, carga/CLS, cascata | Comparação visual, recursos 200, Lighthouse mobile sequencial antes/depois |
| 3 — UX-01/02/03/04/05 | Prioridade ao portfólio: capturas reais, categorias usadas, produto/modelo explícito, detalhe/galeria legíveis; depois home e demais páginas com linguagem visual sóbria | portfolio/index.html, src/portfolio.css, src/js/portfolio*.js, src/data/projects.json, styles.css, oito HTML | Filtros/foco/mobile e preservação de âncoras | Busca/filtros/estado vazio/falha/teclado, nove larguras, revisão visual |
| 4 — ARQ-02/03, CF-04 | Rever duplicação confirmada e build em saída limpa, sem framework | scripts/build.py, scripts/render_portfolio.py e testes pertinentes | Arquivos omitidos ou fonte alterada | Build em cópia, comparar manifesto e testar dist |
| 5 — QA e entrega | Regressão das oito rotas, formulário, acessibilidade e performance | testes/documentação/evidências | Cobertura parcial ou medições variáveis | Logs e screenshots; metas verificadas sem promessa de score |

P1 = impacto comercial/performance e portfólio; P2 = manutenção/hardening; P3 = editorial e aprofundamento. Sem exclusões de arquivos, nova arquitetura ou novas páginas de cases por enquanto. Aprovação adicional antes de mudança estrutural relevante, infraestrutura, headers incompatíveis, deploy ou publicação. Não fazer push automático.

Direção visual: manter logos, azul-marinho e acento ciano; retirar glow/3D decorativos, reduzir cards repetitivos, usar composição editorial, tipos e espaçamento consistentes. Conteúdo só com evidência. Preservar oito URLs e âncoras já usadas.

Dados necessários: qual WhatsApp é oficial (final 0827 ou 6133)? Qual grafia comercial oficial (Technology ou Tecnology)? Logs/configurações Cloudflare podem ficar como pendência sem bloquear melhorias locais aprovadas. Política de privacidade exige confirmação operacional; nenhuma redação deve prometer práticas inexistentes.

Aprovação proposta: etapas locais 1–5, mantendo decisões comerciais pendentes até confirmação. Publicação, DNS, contas e alterações de infraestrutura continuam fora do escopo autorizado.
