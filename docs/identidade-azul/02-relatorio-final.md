# Relatório técnico — identidade azul, logotipo e UX/UI

Data: 23/10/2026 (America/Sao_Paulo). Branch: `audit/aquila-diagnostico-2026-10-23`. Ponto de restauração criado antes das modificações: `006b523`. Sem push, publicação, alteração de DNS, credenciais, headers de produção ou processo de deploy.

## A. Problemas encontrados e tratamento

| ID | Classificação | Evidência e impacto | Correção / status | Resultado da validação |
|---|---|---|---|---|
| MAR-01 | Alto | Vermelho em tokens, acentos do consentimento e theme-color contrariava a nova identidade | Corrigido: azul #0057B8 e tokens semânticos | CSS/HTML revistos; axe sem violações nas regras executadas |
| LOG-01 | Médio | Logo pequeno e caixas CSS com proporção diferente do símbolo; originais possuem margens transparentes extensas | Corrigido: recorte de margem preservado, fonte de maior resolução, proporção natural, tamanhos maiores e PNG alternativo | 144 verificações de logos no pacote de publicação, formatos PNG/WebP e inspeção visual |
| NAV-01 | Médio | Apenas home e portfólio marcavam página atual | Corrigido: aria-current em todas as oito rotas, menu institucional uniforme e destaque no grupo do destino | Uma página atual correta por rota |
| NAV-02 | Médio | Dois listeners de Escape fechavam submenu e menu de uma vez | Corrigido: primeiro Escape fecha submenu e foca seu título; segundo fecha menu e foca botão | Cenários de teclado passaram |
| FORM-01 | Médio | Erros gerais sem descrição individual por campo | Corrigido: aria-invalid, aria-describedby, mensagem específica, foco no primeiro erro, atualização durante digitação e limites de tamanho | Inválidos e correção posterior testados sem transmissão |
| FORM-02 | Médio | Mensagem anterior não distinguia a preparação do orçamento do envio no serviço externo | Corrigido: “Solicitação preparada. Conclua o envio no WhatsApp”, alternativa quando janela não abrir e captura de exceção | Abertura simulada com sucesso/null e exceção; nenhum envio real |
| UI-01 | Baixo | Texto legal do rodapé e categorias do catálogo muito pequenos | Corrigido: tipografia ampliada e controles/bordas mais consistentes | Regressão em nove larguras e capturas |
| RESP-01 | Alto | Durante a ampliação do logo, o cabeçalho quebrou em duas linhas a 320 px por causa da largura intrínseca da assinatura | Corrigido na implementação: reduzir tracking e gap em telas pequenas, preservando o símbolo de 56 px | Marca e botão na mesma linha, sem colisão ou overflow; cabeçalho-320.png |
| PROD-01 | Médio | HTML público observado é da versão anterior; caminhos otimizados consultados separadamente responderam 403 | Pendente: revisar publicação/versão efetiva e repetir validação após deploy autorizado | Não é 404 confirmado nem motivo para alterar infraestrutura sem acesso |

Nenhum problema crítico foi confirmado neste escopo. O incidente relatado de desaparecimento do logo não foi reproduzido nas duas páginas públicas verificadas; não se atribui uma causa exata sem a ocorrência ou logs correspondentes.

## B. Logotipo: diagnóstico, arquivos e validação

Fontes preservadas: `src/img/logo/logo-preto.png`, `logo-branco.png` e `favicon.png`. São os ativos de marca já presentes no projeto; nenhum símbolo novo foi inventado. Ambos os logos são monocromáticos; não foi identificado um azul oficial nesses arquivos, portanto foi aplicada a paleta azul proposta no briefing ao restante da interface.

O canvas do preto mede 1600×1600, mas a área de conteúdo é (328,411)–(1270,1105). O branco mede 612×408, com conteúdo em (80,17)–(532,351). Isso reduz o tamanho útil quando o arquivo inteiro é encaixado em caixas pequenas. O redesign anterior já tinha derivados recortados; esta etapa amplia sua resolução e presença, sem redesenhar/recolorir a marca.

Agora o cabeçalho claro usa a versão preta, e o rodapé azul profundo usa a branca. `<picture>` prefere WebP e oferece PNG quando o formato WebP não for suportado; não se promete que esse mecanismo sozinho contorne falhas HTTP de ambos os arquivos. Os PNGs têm os mesmos recortes das respectivas versões WebP. Derivados: preto 216×159; branco 216×160. CSS usa largura e altura automática, sem filter, clip-path ou ocultação da marca. Cabeçalho: 72 px desktop, 64 px intermediário, 56 px smartphone; rodapé: 64 px. Nenhum arquivo original foi removido.

No build, os quatro derivados foram conferidos byte a byte e com hashes: [build-links-logos.json](evidencias/build-links-logos.json). Caminhos absolutos, caixa dos nomes, src/srcset e presença no diretório dist foram verificados. No navegador, cada um dos dois logos foi decodificado, medido e avaliado quanto a visibilidade, opacity, filter, clip-path, tamanho e proporção em 72 combinações de rota/resolução. Isso cobre home, PDV, portfólio e as demais cinco páginas. O fallback PNG foi exercitado tornando o source WebP indisponível como formato no teste, sem alterar o arquivo servido.

### Produção: o que foi efetivamente observado

Chrome acessou a home sem www e o portfólio com www, ambos HTTP 200. Nessas respostas, o título ainda contém “Aquila Tecnology”, o HTML usa o caminho antigo `src/img/logo/logo-branco.png` e não há o novo rodapé. O logo público retornou HTTP 200, image/png, 85.603 bytes, naturalWidth 612, display block, visibility visible, opacity 1 e caixa 72×48 sobre fundo escuro. Não houve erro JS observado. Portanto não foi confirmado branco sobre branco, CSS ocultando a marca, arquivo ausente ou 404 nessas páginas.

Requisições independentes por urllib aos dois caminhos WebP otimizados retornaram 403. Isso limita a verificação desses URLs; não permite concluir se é regra de acesso, proteção intermediária ou estado da publicação. Não houve tentativa de contornar o bloqueio. Evidências: [producao.json](evidencias/producao.json), producao-otimizados.json e capturas públicas. O estado atual do painel Cloudflare, branch efetiva, diretório publicado, logs e o episódio específico não foram acessados. A nova versão azul só poderá ser confirmada no domínio após publicação autorizada; os testes completos abaixo foram feitos localmente e na saída de build.

## C. UX/UI e identidade

Tokens centralizados em styles.css: `--color-primary #0057B8`, `--color-primary-dark #003B7A`, `--color-primary-light #EAF3FF`, `--color-deep #071D36`, fundo branco, alternância #F3F5F7, texto #111827 e bordas #E2E8F0. Aliases anteriores apontam para esses tokens para preservar os componentes. Links, botões, filtros ativos, foco e popup usam a mesma identidade. Vermelho deixou de ser acento de marca; vermelho funcional permanece apenas para mensagens/campos de erro (#B42318).

Para texto secundário normal em fundo #F3F5F7, a cor sugerida #64748B dá contraste calculado 4,35:1. Foi ajustada para #526479, obtendo 5,56:1. Branco sobre o azul principal: 6,87:1. Texto secundário do rodapé sobre azul profundo: 11,42:1. Cálculos em contraste-tokens.json; axe foi executado sobre componentes reais.

A organização existente foi preservada: apresentação objetiva, serviços, PDV, projetos/iniciativas, tecnologias, sobre e orçamento. Não foram adicionadas competências, clientes, estatísticas ou cases. Navegação uniforme inclui submenus nativos, indicação da página atual em todas as rotas e comportamento de Escape em níveis. Botão e símbolo não disputam espaço no smartphone. A captura do site institucional exibida no catálogo foi atualizada para a interface azul real, sem substituir modelos demonstrativos por entregas comerciais.

Formulário mantém o destino e a integração WhatsApp existentes; não há requisição de backend nem confirmação de envio no site. Campos vazios/somente espaços são recusados; erros ficam associados aos respectivos campos. Não há spinner ou estado de carregamento artificial para uma operação local síncrona. `window.open` com noopener pode retornar null mesmo ao abrir a janela, portanto o código não classifica esse retorno como erro. Uma exceção real gera orientação alternativa. O usuário conclui o envio no WhatsApp.

O popup automático, as escolhas, revogação e preferências do rodapé foram preservados. A confirmação removida anteriormente não voltou. Preferência por movimento reduzido, skip link, semântica, labels, política, canonical, sitemap, robots, Open Graph e hashes CSP continuam presentes.

## D. Matriz de responsividade

Testes sobre `dist/` servido em :4176, altura 900 px, oito rotas por largura. Não se usou overflow-x:hidden para mascarar problemas.

| Largura | Combinações | Problema encontrado / ajuste | Resultado final |
|---|---|---|---|
| 320 px | 8 | Assinatura larga após aumentar logo; tracking/gap ajustados | Sem overflow; marca/botão alinhados; menus/foco aprovados |
| 375 px | 8 | Conferência do tamanho de marca, controles e colunas | Passou |
| 390 px | 8 | Conferência de hero, formulário, rodapé e modal | Passou |
| 430 px | 8 | Cobertura ampliada em relação ao teste anterior | Passou |
| 768 px | 8 | Menu compacto, imagens e grades | Passou |
| 1024 px | 8 | Menu compacto e submenus, caixa de marca de 64 px | Passou |
| 1366 px | 8 | Menu desktop e marca de 72 px | Passou |
| 1440 px | 8 | Cabeçalho/rodapé/portfólio desktop | Passou |
| 1920 px | 8 | Limite do conteúdo e composição ampla | Passou |

Total: 72 combinações, 144 verificações dos dois logos e 27 screenshots das três páginas principais (home, PDV e portfólio), nas nove larguras. Cada screenshot foi capturado depois de carregar imagens lazy por rolagem. Dados em matriz.json e arquivos home-/pdv-/portfolio-[largura].png. Capturas da home em 320/1440 e detalhes de marca foram revisados visualmente. A ausência de overflow da raiz não constitui por si só auditoria visual completa de todo texto em todos os estados.

## E. Performance e acessibilidade

Medições reais de laboratório com Lighthouse 13.5.0/Chrome headless, preset mobile padrão e throttling simulado. Antes: checkpoint `006b523`, servidor Python em :4175. Depois: saída final dist, mesmo tipo de servidor em :4176. Uma execução final por rota, sequencial entre home/portfólio; testes de navegador também estavam ativos no host. Resultados têm variabilidade e não equivalem a mediana de ensaios isolados, CDN real ou dados de usuários. O popup faz parte da experiência medida.

| Página | Performance antes → depois | FCP | LCP | CLS | TBT | Speed Index | Transferência observada |
|---|---|---|---|---|---|---|---|
| Home | 98 → 98 | 1.05 → 1.06 s | 2.40 → 2.41 s | 0.000 → 0.000 | 0 → 0 ms | 1.05 → 1.06 s | 248 → 255 KiB |
| Portfólio | 100 → 100 | 0.91 → 0.91 s | 1.67 → 1.68 s | 0.000 → 0.000 | 0 → 3 ms | 0.91 → 0.91 s | 442 → 450 KiB |

LCP final ficou abaixo de 2,5 s e CLS abaixo de 0,1 nas duas amostras. SEO e acessibilidade Lighthouse: 100 nas duas rotas. INP não foi medido: não há dados de campo/RUM; TBT não substitui INP. Não se promete o mesmo score em produção. O aumento pequeno de bytes dos logos decorre da melhor resolução; o PNG alternativo não é baixado quando o WebP é selecionado normalmente.

axe-core executado nas oito páginas e dois diálogos: zero violações nas regras WCAG A/AA selecionadas. Não se declara conformidade integral WCAG 2.2 AA sem revisão manual adicional, leitores de tela e dispositivos reais. As verificações executadas de teclado, foco, labels, contraste, semântica e interação estão nos testes/evidências.

### Testes executados

- `tests/identity.browser.cjs` (novo): passou sobre dist — 72 combinações, 144 logos, PNG alternativo, menus/Escape/foco, página atual, imagens, formulário válido/inválido/erro com window.open simulado, zero erros JS e zero respostas locais >=400, axe oito páginas/dois diálogos.
- `tests/redesign.browser.cjs`: regressão inicial passou; artefato em regressao-inicial.txt. A nova matriz amplia essa cobertura para nove larguras e verifica os ajustes finais sobre dist.
- `tests/consent.browser.cjs`: passou.
- `tests/portfolio.browser.cjs`: passou.
- `tests/security.browser.cjs`: passou, incluindo CSP e formulário sem JS sem transmissão.
- `node --test tests/portfolio.test.cjs`: sete testes passaram.
- `python3 tests/seo_test.py`: dois testes passaram.
- `node --check src/js/main.js` e `git diff --check`: passaram.
- `python3 scripts/build.py`: passou. HTML da fonte igual ao pacote; PNG/WebP dos logos presentes e iguais à fonte; zero destinos locais href/src inexistentes; docs/testes/scripts/.git fora da saída.

Ferramentas usadas a partir de /tmp/aquila-audit-tools, sem dependência adicionada à aplicação. Reprodução: servir dist na porta 4176 e executar `SITE_BASE=http://127.0.0.1:4176 NODE_PATH=/tmp/aquila-audit-tools/node_modules node tests/identity.browser.cjs`. A configuração de publicação não foi alterada.

## F. Arquivos

Modificados em relação ao ponto de restauração:

```text
FAQ.html
blog.html
docs/consentimento/README.md
docs/redesign/02-entrega.md
index.html
lgpd.html
pdv.html
portfolio/index.html
privacidade.html
src/consent.css
src/img/optimized/logo-branco.webp
src/img/optimized/logo-preto.webp
src/img/optimized/site-aquila.webp
src/js/main.js
src/portfolio.css
styles.css
termos.html
```

Criados: `src/img/optimized/logo-preto.png`, `src/img/optimized/logo-branco.png`, `tests/identity.browser.cjs`, docs/identidade-azul/01-diagnostico.md, este relatório e evidências. O WebP da captura site-aquila foi atualizado para o tema azul. Nenhum arquivo original, projeto ou página foi excluído.

## G. Pendências

1. Publicação e verificação do tema azul/logos no domínio dependem de autorização. Produção continua na versão observada; não se afirma que já recebeu os ajustes.
2. Cloudflare: confirmar read-only branch, comando/diretório efetivos e logs do episódio. O build local preserva o fluxo existente; nenhum ajuste de conta foi feito.
3. Reproduzir o episódio específico de logo ausente se persistir após publicar o pacote completo: registrar URL, viewport, versão do deploy, respostas do logo/CSS e erros naquele momento. Não há evidência de 404 nas rotas públicas verificadas.
4. Confirmar os números divergentes de WhatsApp (final 0827 no contato/rodapé; 6133 no formulário/PDV) antes de qualquer troca de destinatário.
5. INP de campo, Safari/Firefox, leitores de tela, dispositivos físicos, cookies condicionais da infraestrutura e processos reais de privacidade não foram validados nesta execução.

A entrega local está pronta para revisão. Para publicação futura, usar o processo existente com o pacote completo de dist, após a autorização correspondente; não publicar somente HTML sem os ativos atualizados. O ponto `006b523` permite comparar/recuperar arquivos anteriores sem reset destrutivo.
