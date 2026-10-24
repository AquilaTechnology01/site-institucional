Data: 23/10/2026 (America/Sao_Paulo). Base: commit `de7b7b1`. Branch: `audit/aquila-diagnostico-2026-10-23`. Etapa A/B: diagnóstico e proposta; nenhuma correção de aplicação autorizada nesta etapa.

# SEO técnico

| ID | Descrição / evidência | Impacto | Prioridade | Correção proposta | Status | Validação |
|---|---|---|---|---|---|---|
| SEO-01 | Oito URLs no sitemap, titles únicos, descriptions, canonical próprio, um H1 e OG nas páginas | Base de indexabilidade presente | P3 | Preservar e verificar após cada fase | Verificado | Dois testes Python passaram |
| SEO-02 | Nome/telefone do JSON-LD da home divergem do briefing/contatos | Entidade comercial inconsistente | P1 | Confirmar dados e atualizar também hash CSP | Pendente comercial | index.html:17–35 e COM-01 |
| SEO-03 | blog.html sem artigos | Conteúdo de baixa utilidade atual | P3 | Planejar conteúdo real; não inventar artigos ou mudar URL automaticamente | Pendente editorial | Inspeção |
| SEO-04 | Canonical / e link de catálogo para /index.html | URLs alternativas da mesma página | P2 | Verificar redirecionamentos reais antes de propor consolidação | Pendente infraestrutura | Nenhuma regra criada |

Catálogo público inclui seis projetos no HTML sem JS; renderizador usa escape de texto. robots.txt permite rastreio e aponta sitemap. Zero destinos locais inexistentes na análise de href/src, incluindo caminhos codificados; essa checagem não cobre âncoras nem disponibilidade de links externos. Não há garantia de indexação, rankings, Search Console ou Rich Results. Não foram criados dados comerciais ou avaliações. Validar imagem OG em compartilhamento real, idioma, hierarquia completa e alternativas de imagem após redesign.
