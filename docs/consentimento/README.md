> Atualização de identidade: consulte ../identidade-azul/02-relatorio-final.md para a versão azul atual e a validação de marca e responsividade.

> Estado atual após redesign: fontes do dispositivo e sprite SVG local substituem Google Fonts/jsDelivr. Não há requisições de fontes/ícones a terceiros. O popup permanece em cada carregamento, com tema claro/azul e sem mensagem de sucesso no rodapé. As seções abaixo também registram a implementação anterior; a entrega atual está em ../redesign/02-entrega.md.

# Gerenciamento de preferências — Aquila

Implementado em 23/10/2026, na branch de trabalho `audit/aquila-diagnostico-2026-10-23`. Sem push, publicação, alterações de DNS ou deploy. Este trabalho implementa o novo pedido de consentimento; as propostas de redesign da auditoria anterior permanecem pendentes.

## Inventário e classificação

Inspeção inicial dos oito HTML, dois CSS e três JS originais: sem document.cookie, localStorage, sessionStorage, SDK de analytics, pixel de publicidade ou script externo executável. Scripts locais: menu/formulário, core e interface do portfólio; JSON-LD institucional não é rastreador. Não há backend de formulário: o JavaScript prepara uma URL WhatsApp por ação do visitante. Não há endpoint próprio de armazenamento da decisão.

| Recurso | Classificação e efeito | Cookies / duração |
|---|---|---|
| HTML/CSS/JS e catálogo JSON locais | Conteúdo, navegação e consulta de projetos | Nenhum cookie definido no código |
| Google Fonts, Inter | Recurso visual externo; pedido de rede para Google | Nenhum cookie confirmado pela análise local; não é analytics identificado |
| jsDelivr, Bootstrap Icons 1.11.3 | Recurso visual externo | Nenhum cookie confirmado pela análise local |
| WhatsApp / wa.me | Contato externo solicitado pelo visitante; dados do formulário entram na URL | Cookies/duração no serviço de destino não auditados |
| LinkedIn, GitHub e e-mail | Links de saída; sem SDKs de rastreamento integrados | Destinos não auditados |
| Cloudflare Pages (hospedagem informada) | Entrega e eventual segurança da infraestrutura | Cookies de desafios/configuração efetiva pendentes de verificação em produção |
| Novo localStorage `aquila.consent` | Necessário para lembrar a escolha; fornecedor: a própria Aquila | Validade lógica de 180 dias; armazenamento persiste até remoção/substituição |

A verificação em contexto Chrome local limpo observou zero cookies e sessionStorage vazio. Isso não comprova ausência de cookies em produção ou em serviços abertos posteriormente. Fontes e ícones continuam a gerar pedidos de rede antes de qualquer decisão: não são apresentados como tecnologias opcionais bloqueadas. Não foi presumida sua classificação como publicidade/analytics.

## Funcionamento

Apenas a categoria **Necessários** é exibida. Não há checkboxes falsos para categorias sem integrações. Os botões “Rejeitar opcionais”, “Personalizar” e “Aceitar todos” têm o mesmo estilo. O título/descrição solicitados são acompanhados de esclarecimento de que não há opcionais identificados.

Registro: `{version: 1, decidedAt: ISO, action: accept|reject|custom, necessary: true}`. Não inclui nome, e-mail, IP ou identificador de visitante. O popup informativo aparece em todo carregamento de página, mesmo com decisão válida. Registros inválidos, versão diferente, data futura ou idade igual/superior a 180 dias deixam de ser considerados decisões válidas. O prazo é uma decisão desta implementação, documentado na política, não uma duração presumida de cookie de terceiro. Não há sincronização entre domínios/previews ou dispositivos.

“Preferências de cookies” no rodapé reabre o modal. Escape/Fechar preservam a decisão. “Revogar e apagar decisão” remove a chave e reapresenta a escolha. O modal contém o foco por Tab/Shift+Tab e o devolve ao acionador ao fechar. Mudanças de armazenamento em outra aba atualizam a visibilidade do banner. Falhas de acesso ao localStorage são tratadas; o usuário recebe aviso quando a decisão não puder ser salva. Sem JS, banner/modal ficam inativos, há explicação e link da política no rodapé; não existe integração opcional executável a bloquear.

## Bloqueio e revogação: escopo real

Não há scripts opcionais identificados: nenhum GA, GTM, Meta Pixel ou outro rastreador foi acrescentado, nem URLs fictícias. Não foi criada uma biblioteca genérica de execução de scripts sem uso. Aceitar todos não muda CSP nem libera execução arbitrária. A revogação remove apenas a preferência necessária: não há cookies próprios opcionais ou integração ativa que precise de teardown nesta versão.

Uma integração opcional futura exige implementação e revisão próprias: categoria aplicável, carregamento condicionado à escolha (inclusive em recargas), interrupção/teardown documentado, remoção de cookies próprios quando possível, atualização da política/CSP se necessária e incremento da versão. O registro atual autoriza somente o catálogo atual de recursos; não deve ser interpretado como autorização futura. Scripts já executados não podem ser simplesmente “desexecutados”; cookies de outros domínios e dados já enviados não podem ser apagados por este painel.

## Arquivos

Criados: `src/js/consent.js`, `src/consent.css`, `tests/consent.browser.cjs` e esta documentação/capturas. Modificados: `index.html`, `portfolio/index.html`, `pdv.html`, `FAQ.html`, `blog.html`, `privacidade.html`, `termos.html`, `lgpd.html`. A política existente foi preservada e recebeu a seção `/privacidade.html#cookies`. Sem novas rotas ou alteração de sitemap. O empacotador existente já inclui os novos arquivos por copiar src e HTML.

## Validação executada

- `node --check src/js/consent.js`: passou.
- `node --test tests/portfolio.test.cjs`: sete testes passaram.
- `python3 tests/seo_test.py`: dois testes passaram, incluindo hashes CSP.
- Playwright `tests/portfolio.browser.cjs`: passou, incluindo navegação, busca, seleção, erros de dados e retry.
- Playwright `tests/security.browser.cjs`: passou; oito páginas sem violações CSP, inline bloqueado e formulário sem JS sem transmissão.
- Playwright `tests/consent.browser.cjs`: passou após corrigir a contenção do foco. Cobre primeira visita, aceitar/rejeitar/personalizar, recarga, oito rotas, revogação, versão/data/expiração, storage bloqueado, catálogo funcional após rejeição, ausência de requisições aos rastreadores conhecidos verificados e ausência de cookies no contexto local.
- Larguras 320, 375, 390, 768, 1024 e 1440 px (altura 740): sem overflow da página/banner/modal, Tab/Shift+Tab contidos e restauração de foco por Escape.

Ferramentas Playwright instaladas somente em `/tmp/aquila-audit-tools`, sem dependência adicionada ao site. Reprodução neste ambiente: `NODE_PATH=/tmp/aquila-audit-tools/node_modules node tests/consent.browser.cjs`, com servidor local na porta 4173. Capturas mobile em banner-mobile.png e preferencias-mobile.png.

## Pendências

Validar infraestrutura/cookies reais de produção, subprocessadores e retenção efetiva com os responsáveis. Confirmar processos de privacidade e contatos comerciais já apontados na auditoria; esses dados não foram alterados nesta tarefa. Revisão jurídica e leitores de tela/dispositivos reais não foram executados; não se declara conformidade integral com LGPD ou WCAG por haver um banner. Não houve imagem Cookiebot anexada disponível para comparação visual; o componente usa os tokens visuais existentes da Aquila.

Build final verificado em cópia temporária do projeto: `python3 scripts/build.py` passou e incluiu `src/js/consent.js`, `src/consent.css` e `portfolio/index.html` em dist. `git diff --check` passou. Captura do modal a 390 px revisada visualmente, com texto e ações dentro da tela.

## Atualização: popup centralizado

O aviso inicial agora usa um `dialog` modal centralizado, com fundo escurecido e foco contido. Personalizar troca para o painel de preferências; fechar esse painel retorna ao popup inicial quando não houve decisão. Escape no popup inicial fecha o aviso sem gravar consentimento; o rodapé permite reabri-lo e ele reaparece na próxima navegação, mesmo com decisão salva. Escolhas já salvas continuam válidas.

Teste de consentimento atualizado e aprovado: popup modal, centralização nas seis larguras, teclado, Escape sem consentimento e fluxos anteriores. Testes de SEO passaram. Teste do portfólio ajustado para rejeitar opcionais antes de interagir com a página, respeitando o novo modal. Capturas mobile atualizadas.

## Ajuste do rodapé

“Preferências de cookies” foi integrado à navegação do rodapé nas oito páginas, com o mesmo estilo dos links e área de interação mínima de 44 px. O estilo do acionador fica em styles.css, junto ao rodapé. Revisão visual desktop e verificação geométrica em 320, 390, 768 e 1440 px sem overflow; captura em rodape-desktop.png.

## Aviso sobre uso de dados em todo acesso

Por solicitação do usuário, o popup agora abre em toda abertura/recarregamento das oito páginas, independentemente da preferência salva. Título “Sua privacidade importa”, informações sobre armazenamento da decisão, dados do formulário enviados no link de WhatsApp e conexões a Google Fonts/jsDelivr. Não foram adicionados rastreadores. O botão Fechar e Escape dispensam o aviso sem alterar o registro anterior. A política foi atualizada para explicar essa frequência. A exibição não equivale a novo consentimento nem invalida escolhas prévias.

Validação desta atualização: testes de consentimento, navegação do portfólio e dois testes de SEO passaram; diff sem erros de whitespace. Consentimento testado nas oito páginas e seis larguras, incluindo exibição com escolha salva e fechamento sem alterá-la. Capturas mobile atualizadas.
