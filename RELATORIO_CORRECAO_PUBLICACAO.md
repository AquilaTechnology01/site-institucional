# Correção de publicação e consistência visual

Data: 24/10/2026. Base publicada: `043ebf5`.

## Evidências observadas no domínio público

- A página publicada aponta diretamente para `/styles.css`, `/src/executive-slider.css` e `/src/consent.css`.
- Os três arquivos publicados são idênticos aos da versão aprovada, quando solicitados em uma sessão limpa.
- Os CSS retornam `Cache-Control: public, max-age=14400, must-revalidate`: podem permanecer válidos no navegador por quatro horas, enquanto o HTML já mudou. Isso permite combinar HTML novo com CSS antigo; não prova isoladamente qual arquivo estava no navegador do usuário.
- O build gera referências `/assets/runtime/*.css` e `/assets/runtime/*.js`. Essas referências não aparecem no HTML publicado. Uma solicitação a um bundle esperado retornou HTML de fallback, não CSS. Portanto, a publicação atual não está servindo a saída `dist/` validada.
- Foram verificadas as oito páginas públicas em 390 e 1440 px. Não houve overflow horizontal nem imagens concluídas com erro. A diferença completa de layout relatada não foi reproduzida em sessões limpas; a divergência entre publicação e build foi confirmada.
- Há injeção automática de Cloudflare Web Analytics que a CSP atual bloqueia. Não foi liberado esse script nem alterada a política para permitir rastreamento. Isso é independente do cache de CSS e precisa ser gerenciado no painel se desejado.

## Correções implementadas

1. CSS e JavaScript das oito páginas fonte usam uma versão derivada do conteúdo (`?v=<hash>`). Uma página atualizada passa a solicitar uma URL diferente das antigas referências sem versão, evitando reaproveitar essas cópias de cache.
2. `_headers` exige revalidação de HTML, CSS/JS da fonte e catálogo. Apenas os bundles com hash em `/assets/runtime/*` mantêm cache imutável de um ano. As regras não se sobrepõem aos bundles.
3. O build reconhece referências locais com query string, agrupa os recursos e continua gerando os bundles com hash. Referências externas não são reescritas.
4. `scripts/version_assets.py` atualiza as referências da fonte após mudanças em CSS/JS. É uma tarefa explícita de manutenção; o build continua sem modificar as fontes.
5. README documenta a configuração necessária da publicação. A edição local posterior em `index.html`, que restaurava o popup antigo, foi preservada na árvore de trabalho original. A correção usa uma árvore separada baseada na versão publicada, com o popup aprovado.

Não foram redesenhados novamente os componentes aprovados: a correção visa entregar uma combinação consistente de HTML, CSS e JavaScript. Imagens, textos, formulários, links, consentimento e identidades dos projetos permanecem preservados.

## Validação

- Build válido, referências locais conferidas.
- 6 testes de build, incluindo mudança da URL quando o CSS muda e empacotamento correto de referências versionadas.
- SEO em `dist/`: 2 testes aprovados.
- 16 comparações de estilos entre fonte e build: aprovadas.
- 72 combinações das oito páginas em nove larguras, 144 verificações de logos, imagens, menus, formulário simulado e axe em oito páginas/dois diálogos: aprovadas.
- Consentimento em oito rotas: aprovado, incluindo teclado, armazenamento e recargas.
- Segurança em oito páginas: CSP preservada, script inline bloqueado e formulário sem JS sem transmissão: aprovado.
- `git diff --check`: aprovado.

Esses testes validam o código corrigido localmente. A aplicação dos cabeçalhos pelo Cloudflare e a atualização do domínio exigem que a nova versão seja enviada e publicada.

## Configuração necessária no Cloudflare Pages

| Campo | Valor |
|---|---|
| Branch de produção | `main` |
| Framework | Nenhum / estático |
| Comando de build | `python3 scripts/build.py` |
| Diretório de saída | `dist` |
| Diretório raiz | Raiz do repositório |

A configuração do painel não pôde ser consultada ou alterada por esta sessão. Após configurada e publicada, o HTML do domínio deve referenciar `/assets/runtime/`, e um bundle CSS deve responder com `Content-Type: text/css`, não HTML.

As referências versionadas na fonte e os cabeçalhos também protegem a publicação direta da raiz enquanto a saída é corrigida no painel. Publicar `dist/` continua sendo a configuração recomendada, pois preserva as validações e evita disponibilizar documentação e ferramentas de desenvolvimento.

Referências oficiais: [configuração de build](https://developers.cloudflare.com/pages/configuration/build-configuration/) e [regras de cabeçalhos](https://developers.cloudflare.com/pages/configuration/headers/).
