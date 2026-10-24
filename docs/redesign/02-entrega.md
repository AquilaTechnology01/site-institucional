# Entrega — redesign corporativo Aquila Technology Brasil

Data: 23/10/2026. Branch: `audit/aquila-diagnostico-2026-10-23`. Ponto de restauração anterior: `3b9548f`. Alterações de redesign disponíveis na árvore de trabalho para revisão; nenhum push ou deploy realizado.

## O que foi implementado

Design system de branco, preto #111111, vermelho #E30613, cinza #F5F5F5 e texto #333333/#555555. Tokens de cor, espaçamento, raios, tamanhos responsivos e estados no CSS compartilhado, consolidado de 24.258 para 17.913 bytes. Tipografia Arial/Helvetica do dispositivo evita downloads de fontes. O logotipo oficial foi preservado, com derivados WebP e margens transparentes recortadas.

Cabeçalho sticky com navegação horizontal desktop, contato destacado e submenus nativos Soluções/Institucional. Mobile com controle de abertura, Escape, foco visível e navegação preservada sem JS. Rotas anteriores continuam existentes e acessíveis. Link atual destacado em home e portfólio.

Hero original com mensagem “Tecnologia que transforma negócios.” e duas chamadas. Foto ilustrativa de banco de imagens, identificada como tal; não representa equipe ou sede da empresa. Foto local WebP com srcset/sizes e prioridade de carregamento, sem efeitos de glow ou perspectiva. Serviços existentes reapresentados em quatro categorias; não foram inventadas competências em cibersegurança ou entregas de chatbot. Chatbot continua marcado em desenvolvimento.

Produto PDV, tecnologias, apresentação institucional e formulário preservados. Rodapé compartilhado com logo, serviços, projetos, e-mail, WhatsApp, redes e documentos legais. Preferências de cookies integradas como link visual. Formulário ganhou aviso contextual de transferência ao WhatsApp; destinatários existentes não foram trocados arbitrariamente.

Portfólio preserva seis entradas, busca, filtros, detalhes, galeria, estado vazio, falha/retry e alternativas sem JS. Categorias exibidas derivam dos projetos públicos (Websites e Sistemas); categorias sem projetos não aparecem. Rótulos distinguem produto próprio, projeto institucional e modelos demonstrativos. Captura real do produto e do site substituem placeholders nessas duas entradas. Galerias existentes usam derivados WebP; evidências originais permanecem no repositório. Detalhe rola para a seleção no mobile e permite rolagem interna no desktop.

24 ícones existentes foram reunidos num sprite SVG local, com licença MIT preservada. Google Fonts e dependência runtime do jsDelivr removidos. Todas as fontes, imagens, estilos, scripts e ícones usados pela página são locais. CSP de estilos/fontes passou a self, mantendo hashes corretos do JSON-LD e sem unsafe-inline/eval. Não há analytics ou pixels adicionais. Política e popup foram ajustados ao fluxo real, sem referências a fornecedores que deixaram de ser solicitados.

Popup continua aparecendo a cada carregamento conforme solicitação anterior; escolhas são preservadas e o fechamento não salta a página para o rodapé. Mensagem de sucesso removida anteriormente continua ausente. Fechar aviso não é consentir.

## Referência e diferenças

[Stefanini](https://stefanini.com/pt/) foi consultada via leitura e navegador. Aplicamos princípios de navegação por soluções, seções institucionais claras e contato destacado. A inspeção de estilos computados retornou azul #1032CF, #2A4EEF e #0067CC, branco, #F5F5F5 e textos escuros (#141414/#0B1641). Não foi inferida uma paleta completa. O vermelho solicitado no briefing foi aplicado à Aquila; não se afirma que seja a cor real da referência. Captura e cores em evidencias/referencia-stefanini.png e referencia.json. Nenhum layout completo, ativo ou texto comercial da concorrente foi copiado.

## Performance medida

Lighthouse 13.5.0, Chrome headless, preset mobile padrão com throttling simulado. Uma execução final por rota, sequencial entre home/portfólio. Antes servido do checkpoint Git em :4174; depois do projeto em :4173, ambos com servidor Python local. Jobs de teste também estavam ativos no host, portanto há variação por contenção e não se trata de mediana de ensaios isolados. JSONs completos guardam configuração, browser e resultados. O popup automático faz parte da experiência medida nas duas versões. CDN/compressão de produção não são reproduzidos pelo servidor local.

| Página | Performance antes → depois | FCP | LCP | CLS | TBT | Speed Index | Transferência observada | Requisições |
|---|---|---|---|---|---|---|---|---|
| Home | 69 → 98 | 3.07 → 1.05 s | 10.74 → 2.33 s | 0.000 → 0.000 | 0 → 0 ms | 3.08 → 1.05 s | 1919 → 248 KiB | 14 → 11 |
| Portfólio | 88 → 100 | 2.50 → 0.91 s | 3.18 → 1.68 s | 0.093 → 0.000 | 0 → 0 ms | 2.50 → 0.91 s | 1477 → 442 KiB | 19 → 17 |

LCP final ficou abaixo de 2,5 s, CLS abaixo de 0,1 e performance acima de 90 nas duas amostras finais. SEO e acessibilidade Lighthouse: 100 nas duas rotas. INP não medido: exige dados reais de interação/campo; TBT não substitui INP. Não prometer os mesmos scores em produção ou em todas as visitas. Uma rodada intermediária identificou CLS causado pelo menu inicialmente expandido e contraste insuficiente em uma etiqueta do PDV; ambos corrigidos e revalidados antes dos resultados finais.

## Testes executados

- Node: sete testes unitários do catálogo passaram.
- Python: dois testes de SEO passaram (oito URLs, títulos/canonicals/H1 e hash CSP do JSON-LD).
- Playwright portfólio: navegação/recarga, busca, filtros, Enter/foco, dados inválidos, falha/retry, menu/Escape e rotas passaram.
- Playwright consentimento: primeira visita, escolhas, revogação, persistência, abertura em todas as rotas, teclado, seis larguras e storage indisponível passaram.
- Playwright segurança: oito páginas sem violações CSP, inline bloqueado e formulário sem JS sem transmissão passaram.
- Novo tests/redesign.browser.cjs: oito páginas × 320/375/390/768/1024/1440/1920 = 56 combinações sem overflow; menus/submenus/Escape, imagens carregadas, ausência de erros JS/recursos locais HTTP >=400 e fechamento de popup sem salto passaram. Formulário válido/inválido verificado com window.open substituído localmente; nenhuma mensagem enviada.
- axe-core em oito páginas e dois diálogos: nenhuma violação nas regras WCAG A/AA executadas. Não equivale a certificação; leitor de tela/dispositivos físicos continuam fora do escopo executado.
- Navegação e submenus sem JavaScript a 390 px verificados no navegador; screenshots mobile/desktop revisados.
- Build real python3 scripts/build.py passou. Oito HTML iguais à fonte na saída; zero destinos locais href/src inexistentes. Docs/testes/scripts/.git excluídos do pacote.

Saída atual: 95 arquivos e 7.220.173 bytes, incluindo os originais preservados e novos derivados. A transferência foi reduzida; o pacote total cresceu porque não foram apagados os ativos originais. Não alterar cache global ou deploy para tentar compensar tamanho. O incidente de deploy de dez minutos continua sem diagnóstico conclusivo por falta dos logs.

## Arquivos

Modificados em relação ao ponto de restauração:

```text
FAQ.html
blog.html
index.html
lgpd.html
pdv.html
portfolio/index.html
privacidade.html
src/consent.css
src/data/projects.json
src/js/consent.js
src/js/main.js
src/js/portfolio-core.js
src/js/portfolio.js
src/portfolio.css
styles.css
termos.html
tests/portfolio.browser.cjs
```

Criados: `src/img/icons.svg`, `src/img/optimized/*.webp`, `portfolio/img/optimized/*.webp`, `tests/redesign.browser.cjs`, esta documentação, licença dos ícones e evidências. `styles.css`, `src/portfolio.css` e `src/consent.css` compõem o tema; HTML e JavaScript anteriores foram modernizados, preservando a arquitetura. Nenhum arquivo original foi excluído. Build/deploy/DNS/credenciais não foram modificados.

## Pendências e publicação

Os números de WhatsApp continuam divergentes: contato principal/rodapé termina em 0827, formulário e PDV em 6133. Confirmar titularidade com a empresa antes de padronizar, pois trocar destino sem confirmação pode encaminhar dados à pessoa errada. Revisão dos processos reais de privacidade, cookies condicionais da infraestrutura, retenção, Search Console, INP de campo e logs Cloudflare dependem de acesso/validação externos. Não foi realizado pentest nem declarada conformidade integral de segurança/LGPD.

Para publicar após revisão e autorização: executar os testes descritos, rodar `python3 scripts/build.py`, revisar `dist/` e conferir no painel existente se o build usa esse comando e publica `dist`. Não alterar automaticamente o painel. Revisar as mudanças Git e enviar à branch de deploy somente após aprovação explícita; o push poderá disparar o deploy automático existente. Validar preview quando disponível e, depois de publicada a versão, conferir HTTPS, rotas, imagens, popup e cabeçalhos. Nenhum push foi feito nesta entrega.

Para comparar ou recuperar um arquivo anterior, usar o commit `3b9548f` como referência; não executar reset destrutivo para rever a interface. Uma cópia desse checkpoint foi usada para a medição antes.
