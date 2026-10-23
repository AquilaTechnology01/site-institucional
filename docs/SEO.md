# Busca e indexação

Domínio usado: https://www.aquilatechnology.com.br/ (respondeu HTTP 200 na verificação de 22/10/2026).

Foram adicionados sitemap XML com oito URLs e robots.txt permitindo rastreamento e indicando o sitemap. Cada página tem canonical próprio e Open Graph com URLs absolutas. Títulos e H1 das páginas comerciais descrevem os serviços. Os dados Organization da home têm URL, identificador e logotipo; o hash CSP foi atualizado para esse bloco. Não foram inventados avaliações, endereço físico ou dados de clientes.

O portfólio contém os seis projetos no HTML inicial para leitura sem JavaScript. `scripts/render_portfolio.py` atualiza esse conteúdo a partir do JSON; o build executa essa etapa automaticamente e inclui sitemap e robots no pacote. Após editar o catálogo, execute `python3 scripts/build.py`.

## Publicar e solicitar indexação

1. Publicar os arquivos de `dist/` na hospedagem existente, preservando a estrutura. Nenhum deploy foi executado nesta tarefa.
2. Conferir se a home, `/portfolio/`, `/robots.txt` e `/sitemap.xml` respondem 200 no domínio público. Garantir que cabeçalhos da hospedagem não incluam `X-Robots-Tag: noindex` e que não haja autenticação ou desafios que bloqueiem Googlebot.
3. Adicionar o domínio no [Google Search Console](https://search.google.com/search-console/) e verificar a propriedade com o registro DNS fornecido pelo Google. É necessário acesso à conta e ao DNS; não há token fictício nos arquivos.
4. Enviar `https://www.aquilatechnology.com.br/sitemap.xml` no relatório Sitemaps.
5. Inspecionar a home, `/pdv.html` e `/portfolio/` e solicitar indexação. Acompanhar o relatório de indexação e as consultas de pesquisa.
6. Na hospedagem, consolidar HTTP em HTTPS, domínio sem www no domínio com www e `/index.html` em `/` com redirecionamentos permanentes, preservando caminhos e parâmetros. A configuração depende do provedor e não foi alterada aqui.

O sitemap facilita descoberta; não garante indexação ou posição. Conteúdo original e útil, páginas rápidas, referências legítimas de outros sites e informações comerciais consistentes contribuem para o trabalho contínuo. O blog ainda está vazio; publicar artigos reais antes de ampliar seu destaque. Não usar repetição artificial de palavras-chave, páginas duplicadas ou depoimentos inventados.

## Verificação local

```sh
python3 scripts/build.py
python3 tests/seo_test.py
node --test tests/portfolio.test.cjs
```

Também foram executados os testes de navegação e CSP no Chrome local. Os testes locais não comprovam indexação ou configuração da hospedagem. O hash CSP do JSON-LD precisa ser atualizado se esse bloco mudar.

Referências oficiais: [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [solicitar rastreamento](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl), [perguntas de indexação](https://developers.google.com/search/help/crawling-index-faq).
