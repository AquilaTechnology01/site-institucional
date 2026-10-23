# Revisão de segurança — 22/10/2026

Escopo: código público local das oito páginas HTML, três scripts JavaScript, catálogo JSON e empacotador Python. Não foram feitos testes contra o domínio de produção, servidor, TLS, contas ou serviços externos. O repositório é um site estático, sem backend, autenticação ou dependências de aplicação gerenciadas por npm. A análise não certifica ausência de vulnerabilidades.

## Achados e alterações

| Prioridade | Achado | Tratamento |
| --- | --- | --- |
| Média — privacidade | O formulário sem `method` usa GET por padrão. Se o JavaScript falhar ou estiver desativado, os campos podem ir para a URL da página, histórico e logs. | Adicionado `method="post"` e CSP `form-action 'none'`. O fluxo JavaScript continua abrindo o WhatsApp; nenhum envio HTML nativo é necessário. |
| Baixa | A validação de imagens aceitava `..` e sequências percentuais que podiam sair de `/src/img/` ou `/portfolio/img/` na normalização do navegador. | Bloqueados segmentos de navegação, barras invertidas, caracteres de controle, codificação inválida e dupla codificação. Testes cobrem capa e galeria. Não foi demonstrada leitura de arquivos privados nem execução de código por esse achado. |
| Reforço preventivo | Não havia CSP nas páginas. | Adicionada política via meta: scripts locais, hash para JSON-LD existente, fontes e CSS nos provedores usados, imagens e fetch locais; objetos, frames, base e submissão HTML bloqueados. Não usa `unsafe-inline` ou `unsafe-eval`. |

Adicionada também política explícita de referenciador `strict-origin-when-cross-origin`. Os textos dinâmicos usam `textContent`, as mensagens do WhatsApp usam `encodeURIComponent`, os destinos de links do catálogo são validados e novas abas usam `noopener noreferrer`. Não foram encontrados padrões comuns de chaves privadas, tokens GitHub, chaves AWS ou chaves no formato `sk-` nos arquivos de texto atuais. Essa busca não cobre todo formato possível, histórico Git ou conteúdo visual de imagens.

## Pendências de hospedagem

Não há configuração do provedor no checkout, portanto não se pode afirmar se os cabeçalhos abaixo estão ausentes em produção. Verificar na resposta HTTP real:

- CSP por cabeçalho com `frame-ancestors 'none'` ou `X-Frame-Options: DENY`, para impedir enquadramento por outros sites. `frame-src 'none'` na meta não resolve clickjacking; `frame-ancestors` não funciona em meta.
- `X-Content-Type-Options: nosniff`, tipos MIME corretos (inclusive imagens sem extensão em `src/img/PDV/`) e HTTPS/HSTS após validar o domínio.
- Bloqueio de `.git`, arquivos de configuração, documentação interna e listagem de diretórios. Publicar apenas artefatos públicos.

CSS e fontes de terceiros continuam sendo carregados de Google Fonts e jsDelivr. O CSS de ícones está fixado na versão 1.11.3, mas não possui SRI; hospedagem local desses recursos ou integridade verificável reduz dependência do fornecedor. Isso é um risco residual de cadeia de fornecimento, não uma exploração confirmada.

Na revisão de segurança, o empacotamento falhava por ausência de `robots.txt`. A atualização posterior de SEO restaurou esse arquivo e validou o build completo; nenhuma publicação foi executada.

## Verificação

Resultado: sete testes de lógica aprovados; navegação, filtros, recuperação de falhas e cinco larguras aprovados; oito páginas sem violações CSP no teste, script inline injetado bloqueado e formulário sem JavaScript sem transmissão de dados. Sintaxe dos três scripts e verificação de whitespace (respeitando CRLF existente) aprovadas.

Executar:

```sh
node --test tests/portfolio.test.cjs
python3 -m http.server 4173 --bind 127.0.0.1
NODE_PATH=/tmp/aquila-browser-qa/node_modules node tests/portfolio.browser.cjs
NODE_PATH=/tmp/aquila-browser-qa/node_modules node tests/security.browser.cjs
```

As ferramentas de navegador usam Playwright instalado em diretório temporário e Chrome local. A política CSP depende do conteúdo exato do JSON-LD para seu hash: alterações futuras nesse bloco exigem atualizar o hash na meta da home.

Referências: [OWASP HTTP Headers Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html), [MDN CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP), [MDN frame-ancestors](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors).
