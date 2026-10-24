Data: 23/10/2026 (America/Sao_Paulo). Base: commit `de7b7b1`. Branch: `audit/aquila-diagnostico-2026-10-23`. Etapa A/B: diagnóstico e proposta; nenhuma correção de aplicação autorizada nesta etapa.

# Cloudflare Pages e investigação de deploy

| ID | Descrição / evidência | Impacto | Prioridade | Correção proposta | Status | Validação |
|---|---|---|---|---|---|---|
| CF-01 | Sem wrangler, _headers, _redirects ou workflow CI versionado | Configuração efetiva depende do painel | P2 | Conferir painel read-only: comando, saída, branch e previews | Pendente acesso | Inventário versionado |
| CF-02 | scripts/build.py sugere python3 scripts/build.py e dist | Divergência possível entre painel e repositório | P2 | Documentar valores efetivos, sem alterar deploy | Pendente acesso | Comando inferido do script; painel não confirmado |
| CF-03 | Relato de deploy de dez minutos; sem logs do evento | Causa desconhecida | P2 | Comparar fila, clone, ambiente, build, upload e publicação pelos timestamps | Pendente logs | Nenhuma falha da Cloudflare comprovada |
| CF-04 | dist reaproveitado e render altera fonte | Risco de resíduos e mudanças locais no build | P2 | Revisar empacotamento após aprovação, preservando arquitetura | Proposto | build.py:7–15 |

Aplicação sem instalação npm de produção, ~5,96 MB versionados e 67 arquivos; isso não explica isoladamente dez minutos. Não há evidência de build pesado no código. Possibilidades a investigar, não diagnósticos: fila, provisionamento, checkout, configuração de comando e upload. Preservar GitHub e deploy automático; nenhum push realizado.

HEAD em home/portfólio confirma server cloudflare, HTTPS 200, cache-control public,max-age=0,must-revalidate, nosniff e referrer-policy. Não impor cache global longo: ativos atuais não têm hashes e poderiam ficar desatualizados. Ausência de content-encoding em HEAD não comprova ausência de compressão em GET. Não foram alterados DNS, headers, credenciais ou configuração de produção. Domínio público Cloudflare não comprova sozinho todos os valores do Pages.

Pendências: painel de branch/build/output, logs do incidente, preview headers/indexabilidade, redirecionamentos de domínio e subdomínios. Empacotador deve continuar excluindo docs/testes/scripts; verificar que o painel publica dist, não a raiz.
