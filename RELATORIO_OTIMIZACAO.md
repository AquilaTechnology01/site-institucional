# RELATÓRIO DE OTIMIZAÇÃO — AQUILA TECHNOLOGY BRASIL

Data: 23/10/2026 (America/Sao_Paulo). Branch: `audit/aquila-diagnostico-2026-10-23`. Ponto de restauração anterior: **`b7e6bcb`**. Nenhum push, deploy, DNS, credencial ou configuração de conta foi alterado.

## 1. Diagnóstico inicial

Site multipágina HTML/CSS/JavaScript nativo, com oito rotas: `/`, `/portfolio/`, `/pdv.html`, `/FAQ.html`, `/blog.html`, `/privacidade.html`, `/termos.html`, `/lgpd.html`. Build Python, sem npm de produção, frameworks ou bibliotecas de animação. Dependência visual externa de origem: sprite local de Bootstrap Icons, preservado; nenhuma fonte, analytics ou pixel externo foi acrescentado.

Antes: **219 arquivos versionados, 39,650,208 bytes** de conteúdo de arquivos; saída **97 arquivos, 7,273,447 bytes**. O `du -sh .` inicial informou cerca de 80 MB, incluindo Git, dist e evidências; `du --exclude=.git` informou cerca de 46 MB. Esses números não são transferência por página. Os principais pesos eram auditorias/screenshot históricos, originais PNG, o fundo antigo de 1,37 MB e cópias duplicadas. O favicon usava um PNG de 612×408 para uma finalidade de poucos pixels.

O empacotador antigo alterava portfolio/index.html na fonte, reaproveitava dist sem limpeza e copiava indiscriminadamente os diretórios públicos. Havia seletores e marcadores sem efeito, listeners de ícone interno desnecessários, código do formulário carregado nas oito páginas e três folhas de estilo no portfólio. A declaração `background: var(--text)99` do backdrop era inválida e ignorada pelo navegador.

Referências HTML/CSS/JS/JSON, galerias dinâmicas, fallback de imagem, testes, scripts e documentação foram considerados. Não foi encontrado service worker ou manifesto com referências adicionais. Inventário com classificação, referências e SHA-256: [inventario-antes.json](docs/otimizacao/evidencias/inventario-antes.json). Arquivos apenas citados no histórico foram marcados para validação manual, não tratados automaticamente como lixo.

## 2. Arquivos removidos

Somente estas duas cópias de evidências foram excluídas, após comparação byte a byte e atualização do relatório que as referencia:

| Arquivo removido | Cópia canônica preservada | Justificativa |
|---|---|---|
| docs/identidade-azul/evidencias/producao-home.png | docs/auditoria/evidencias/home-antes.png | SHA-256 e conteúdo idênticos; fora do runtime |
| docs/identidade-azul/evidencias/producao-portfolio.png | docs/auditoria/evidencias/portfolio-antes.png | SHA-256 e conteúdo idênticos; fora do runtime |

Juntas ocupavam **1.923.829 bytes após recompressão**. Registro: [remocoes.json](docs/otimizacao/evidencias/remocoes.json). Recuperáveis pelo checkpoint Git. As duas novas capturas desta auditoria foram armazenadas em WebP lossless, sem manter cópias PNG redundantes; são saídas geradas nesta execução, não evidências históricas apagadas.

Nenhuma página, projeto, logo, original fotográfico, integração ou arquivo de finalidade incerta foi excluído. Logs iguais de fases diferentes continuam preservados, pois documentam execuções distintas. Favicon/logo branco e imagens equivalentes do PDV mantêm URLs legadas por compatibilidade; o catálogo usa a imagem canônica do PDV. Arquivos temporários de staging são removidos automaticamente, e dist é uma saída reprodutível ignorada no Git.

## 3. Código otimizado

| Arquivos | Alteração e motivo |
|---|---|
| Oito HTML | Marcadores reveal e elemento interno do botão de menu sem função removidos; favicon adequado; busca/filtros/semântica/labels/metadados e conteúdos preservados |
| styles.css | Seletores comprovadamente mortos removidos, regras consecutivas do menu consolidadas; tokens azuis e preferência por movimento reduzido mantidos |
| src/consent.css | Regras repetidas consolidadas; backdrop corrigido para token --color-overlay válido; controles e foco preservados |
| src/portfolio.css | Variável não utilizada e regras duplicadas removidas, mantendo espaço reservado dos filtros e breakpoints |
| src/js/main.js e novo contact.js | Menu/ano continuam compartilhados; formulário separado e carregado só na home; queries/alterações de classes sem efeito removidas |
| portfolio.js / portfolio-core.js | Miniaturas responsivas com URLs/larguras validadas, fallback que também remove srcset inválido e criação de filtros organizada sem queries globais repetidas |
| scripts/render_portfolio.py | Permite renderizar para destino separado, inclui srcset/sizes no HTML sem JS e falha se a estrutura esperada mudar |
| scripts/build.py | Staging limpo, validação antes da troca, rollback em falha, sem mutação da fonte; cópia por formatos públicos permitidos, JSON compacto, CSS minificado e scripts agrupados |
| _headers | Cache prolongado exclusivamente no diretório de bundles gerados com hash no nome |
| README / testes | Processo e ferramentas documentados; testes aceitam servidor/artefatos configuráveis, evitando sobrescrever evidências de fases anteriores |

A fonte permanece legível. CSS é minificado no build com preservação de strings, espaços necessários em calc e seletores descendentes como `.form :invalid`. JavaScript é agrupado respeitando dependências e sem reescrita da sintaxe. Não foi introduzido framework, transpilador, bundler npm ou mudança de arquitetura. Cabeçalhos/rodapés estáticos continuam nos HTML para preservar a arquitetura multipágina e a indexabilidade.

Os nomes do comando e saída continuam **`python3 scripts/build.py` → `dist/`**. Arquivos públicos anteriores continuam disponíveis, enquanto o HTML usa os bundles com hash. Arquivos `.env`, mapas, logs, bancos, chaves, caches e JSONs não autorizados não são copiados pela nova seleção. O build verifica referências de páginas e imagens do catálogo antes de substituir a saída. Se falhar, preserva o dist anterior.

## 4. Imagens e evidências

- **41 PNGs** recompostos com compressão sem perda: **815.504 bytes poupados nessa etapa**, antes das remoções de duplicatas. Pixels RGBA foram comparados por SHA-256 e perfis ICC preservados. A lista individual de arquivos, pesos e hashes está em [png-sem-perda.json](docs/otimizacao/evidencias/png-sem-perda.json). Isso inclui originais do site e evidências, sem mudar sua aparência.
- Miniaturas WebP de **480 e 800 px** para os seis cartões do portfólio. Fonte integral, capturas e links de ampliação permanecem disponíveis. `srcset` e `sizes` são usados tanto no HTML estático quanto na interface JS. Esses derivados são redimensionados e codificados com qualidade 85; não são apresentados como pixel a pixel idênticos ao original. As galerias integrais não foram degradadas.
- Favicons preto/claro e branco/escuro de **64×64**, derivados dos símbolos oficiais, com transparência e proporção preservadas: 3.844 e 3.178 bytes. A seleção considera o tema da interface do navegador. Originais continuam no repositório e no pacote.
- Logotipos principais não foram redesenhados nem substituídos; os PNGs originais receberam somente compressão sem perda. Imagens do hero continuam com prioridade, srcset e dimensões; capturas fora da área inicial mantêm lazy loading.
- Novas capturas desta auditoria: [home](docs/otimizacao/evidencias/home-depois.webp) e [popup](docs/otimizacao/evidencias/popup-depois.webp). Conversão lossless com comparação RGBA em capturas-sem-perda.json. Capturas futuras são opt-in no teste para evitar crescimento automático do repositório.

Regeneração de derivados: `python3 scripts/optimize_images.py`. Pillow é necessário apenas para essa tarefa de manutenção; o build usa a biblioteca padrão do Python.

## 5. Dependências

Nenhuma dependência npm foi removida/atualizada, pois não existe package.json ou lockfile de aplicação. Não foram instaladas dependências de produção. Playwright, axe-core e Lighthouse já disponíveis em /tmp foram utilizados para testes. O sprite de ícones e sua licença permanecem preservados. Não houve atualização de versão principal ou remoção de biblioteca legítima.

## 6. Performance e tamanhos

**Build:** 7,273,447 → **7,164,933 bytes**, redução de **108,514 bytes (1.49%)**. A contagem aumentou de 97 para 118 arquivos por causa de miniaturas, favicons e bundles; isso não significa mais requisições por visita. Originais e URLs legadas explicam a redução moderada do pacote inteiro.

**Árvore de trabalho:** 39,650,208 → **38,006,577 bytes** de arquivos regulares, incluindo ferramentas, relatório e evidências desta execução; 219 → 267 arquivos. Aumentos de contagem decorrem dos novos tamanhos responsivos e testes. Exclui .git, dist e caches. O histórico Git foi preservado e pode crescer devido ao checkpoint; não houve expurgo destrutivo para produzir um número menor. Medições em tamanhos.json.

Medições antes/depois com Lighthouse 13.5.0, Chrome headless, preset mobile e throttling simulado, servidores Python equivalentes: checkpoint em :4177 e build otimizado em :4178. Uma amostra final por rota, sequencial entre home/portfólio; testes de navegador também rodavam no host. Não é mediana de ensaios isolados nem medição de produção. O popup automático faz parte de ambas as experiências. Resultados completos de métricas/requisições, sem screenshots ou traces pesados embutidos, estão nos JSONs resumidos desta auditoria.

### Home

| Indicador | Antes | Depois |
|---|---:|---:|
| JavaScript transferido | 8,913 bytes | 8,720 bytes |
| CSS transferido | 22,624 bytes | 18,659 bytes |
| Imagens, SVG e favicon transferidos | 204,843 bytes | 123,083 bytes |
| Transferência total | 261,381 bytes | 175,526 bytes |
| LCP | 2.41 s | 1.88 s |
| FCP | 1.06 s | 0.93 s |
| CLS | 0  | 0  |
| TBT | 0 ms | 0 ms |
| Speed Index | 1.06 s | 0.93 s |
| Requisições HTTP | 11  | 10  |
| Lighthouse Performance | 98  | 100  |
| INP de campo | Indisponível | Indisponível |

### Portfólio

| Indicador | Antes | Depois |
|---|---:|---:|
| JavaScript transferido | 18,511 bytes | 16,281 bytes |
| CSS transferido | 26,727 bytes | 22,133 bytes |
| Imagens, SVG e favicon transferidos | 389,856 bytes | 191,990 bytes |
| Transferência total | 460,730 bytes | 256,523 bytes |
| LCP | 1.66 s | 1.54 s |
| FCP | 0.91 s | 1.06 s |
| CLS | 0  | 0  |
| TBT | 0 ms | 0 ms |
| Speed Index | 0.91 s | 1.06 s |
| Requisições HTTP | 17  | 14  |
| Lighthouse Performance | 100  | 100  |
| INP de campo | Indisponível | Indisponível |


Redução de transferência total: **32,85% na home** e **44,32% no portfólio**. Imagens incluem favicon e sprite SVG mesmo quando o navegador os classifica como Other; JS/CSS são somados pelo tipo de recurso da auditoria. As contagens incluem apenas o que foi solicitado durante a medição, não todas as imagens que alguém poderá abrir nas galerias.

LCP ficou abaixo de 2,5 s e CLS abaixo de 0,1 nessas amostras finais. INP continua indisponível por falta de dados reais de interação/campo; TBT não o substitui. Não há garantia de scores em produção ou em todas as visitas. Cache/compressão da Cloudflare não são reproduzidos pelo servidor local.

## 7. Segurança e Cloudflare Pages

O risco de resíduos no dist e cópia indiscriminada foi reduzido pelo build limpo/seleção de formatos e validado com arquivos de teste `.env`, log, JSON privado e resíduo antigo. Não havia evidência de credenciais realmente publicadas no código inspecionado. Uma busca estática por padrões de segredos não encontrou candidatos; não é uma garantia de ausência de segredos ou auditoria de contas/histórico completo.

CSP, hash do JSON-LD, links externos protegidos, formulário e consentimento foram preservados. Não há analytics/pixels opcionais adicionados. O popup continua aparecendo em cada abertura, como solicitado anteriormente, sem ressuscitar a mensagem de confirmação removida do rodapé.

Cache imutável de um ano se aplica somente a `/assets/runtime/*`, cujos arquivos têm hash de conteúdo verificado. HTML, catálogo JSON, imagens e nomes legados ficam com a política padrão da plataforma. Essa configuração segue o formato documentado para [headers de arquivos estáticos da Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/headers/). Nenhuma regra global de cache foi imposta. `_headers` está versionado/preparado no pacote; não foi aplicado em produção por esta execução.

Uma consulta pública pontual ao domínio por urllib retornou 403; não se atribuiu causa nem se tentou contornar o bloqueio. Cabeçalhos/cache/compressão efetivos após a futura publicação exigem validação no domínio. Nenhum painel, branch de deploy, DNS ou credencial foi alterado.

## 8. Testes executados

| Teste | Resultado |
|---|---|
| Python build_test.py | 4 passaram: não mutar fonte/rotas, limpeza de resíduos/arquivos indevidos, hashes/cache/repetibilidade, rollback e minificação conservadora |
| Node portfolio.test.cjs | 8 passaram, incluindo validação de variantes responsivas e URLs maliciosas |
| SEO Python | 2 passaram sobre a fonte e 2 sobre dist, incluindo sitemap/canonical/H1/hash CSP |
| optimization.browser.cjs | 16 comparações fonte/build (8 rotas × 390/1440) com estilos iguais em popup, menu, conteúdo/erros; backdrop exato, favicons acessíveis, menu/catálogo sem JS e reduced-motion |
| identity.browser.cjs sobre dist | 72 combinações (9 larguras, incluindo as 7 solicitadas), 144 logos, fallback PNG, menu/foco/Escape, página atual, imagens, formulário simulado, zero erros JS/rede local |
| axe-core | Zero violações nas regras A/AA executadas nas 8 páginas e 2 diálogos |
| consent.browser.cjs sobre dist | Passou: escolhas, revogação, persistência, teclado, mobile e storage indisponível |
| portfolio.browser.cjs sobre dist | Passou: navegação/recarga, busca/filtros, seleção/foco, falha/retry, rotas |
| security.browser.cjs sobre dist | Passou: CSP nas 8 páginas, inline bloqueado, formulário sem JS sem transmissão |
| Sintaxe/diff | node --check dos JS alterados e git diff --check passaram |

Os testes não enviaram dados reais: `window.open` foi substituído localmente. A matriz inclui 320, 375, 390, 430, 768, 1024, 1366, 1440 e 1920 px. Nesta execução, o teste de identidade reutilizável rodou sem recriar 27 screenshots pesados; existem duas capturas novas otimizadas, além das evidências históricas preservadas. Dados e logs em docs/otimizacao/evidencias. Não se declara conformidade integral WCAG somente pela análise automatizada.

## 9. Pendências

- Arquivos antigos com possível valor de prova ou URLs externas, incluindo o fundo futurista e originais PNG, permanecem. Excluí-los exigiria validar consumidores externos/finalidade; não houve autorização inferida para remover material incerto.
- As evidências antigas ocupam grande parte do repositório. Um eventual arquivamento fora do Git requer decisão sobre retenção e links existentes; não foi executado.
- Confirmar os WhatsApps divergentes (0827 no contato/rodapé e 6133 no formulário/PDV) antes de alterar destinatários.
- INP de campo, testes físicos/leitores de tela/Safari/Firefox, painel e logs Cloudflare, retenção/processos de privacidade e comportamento dos headers em produção permanecem fora da validação executada.

## 10. Publicação e revisão

O pacote está preparado para revisão e publicação estática no Cloudflare Pages, mantendo comando/diretório e integração existentes. Confirmar no painel o comando `python3 scripts/build.py`, saída `dist` e branch usada; essas configurações externas não foram acessadas. Publicar o pacote completo, incluindo assets/runtime e _headers, somente após revisão/autorização. O push pode acionar o deploy automático; **nenhum push ou deploy foi realizado**.

Para reproduzir: executar build, servir dist em :4178 e rodar os testes com SITE_BASE=http://127.0.0.1:4178. O teste de equivalência também usa SOURCE_BASE (:4173 por padrão). CAPTURE_SCREENSHOTS=1 gera novas capturas; por padrão não acumula imagens. O build não inclui docs/testes/scripts/.git e não depende de Pillow ou npm.

Lista completa de arquivos alterados/adicionados: [arquivos-alterados.json](docs/otimizacao/evidencias/arquivos-alterados.json). Os dois arquivos removidos estão discriminados acima. O ponto b7e6bcb permite recuperar os originais anteriores sem reset destrutivo. A identidade azul, todas as páginas, conteúdos, seis projetos, logotipos, navegação, orçamento e consentimento permanecem operacionais nos testes realizados.
