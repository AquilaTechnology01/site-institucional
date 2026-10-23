# Portfólio Aquila

## Auditoria e arquitetura

Raiz: este checkout `site-institucional`. Branch de trabalho: `feature/aquila-portfolio-interativo`; a auditoria começou na `main`, sem alterações locais. Entradas existentes: `index.html`, `pdv.html`, `FAQ.html`, `blog.html`, `privacidade.html`, `termos.html`, `lgpd.html`. HTML/CSS/JS puro, sem framework, gerenciador de pacotes, testes ou build prévios. Estilos e comportamento compartilhados: `styles.css` e `src/js/main.js`. Nenhum deles foi alterado.

Nova entrada: `portfolio/index.html`. CSS isolado em `src/portfolio.css`, lógica em `src/js/portfolio.js`, funções de validação/busca em `src/js/portfolio-core.js` e catálogo em `src/data/projects.json`. Cabeçalho, rodapé, fontes, cores, identidade e menu móvel reaproveitados. Um link foi acrescentado à navegação de cada página existente; os links anteriores e seções foram mantidos.

O remoto é um repositório GitHub. Não há configuração de deploy, CNAME, workflow ou indicação confiável do provedor de hospedagem. O domínio informado não pôde ser consultado pela ferramenta web durante a auditoria. A referência funcional foi consultada apenas para seleção e visualização; nenhum material foi copiado.

## Executar, verificar e empacotar

Não é necessário instalar dependências. Requer Python 3; os testes de lógica requerem Node.js 18 ou superior.

```sh
python3 -m http.server 4173 --bind 127.0.0.1
# Abra http://127.0.0.1:4173/portfolio/
node --test tests/*.test.cjs
node --check src/js/portfolio-core.js
node --check src/js/portfolio.js
python3 scripts/build.py
```

`dist/` é ignorado pelo Git. O empacotamento copia os arquivos públicos existentes e o módulo novo, sem Git, documentação ou testes. Não há minificação ou dependências de runtime adicionais.

## Publicação manual

Nenhum deploy ou push é executado. Confirme primeiro o provedor atual e mantenha suas políticas de segurança, cabeçalhos, scripts e integrações. Envie os arquivos de `dist/` para a raiz pública, preservando os demais arquivos da hospedagem. O site pressupõe domínio na raiz, como o institucional atual.

O servidor deve servir `portfolio/index.html` para `/portfolio/` e redirecionar `/portfolio` para `/portfolio/`. Apache/Nginx e servidores estáticos com índice de diretório normalmente oferecem esse comportamento. Não é necessário fallback de SPA. Se a plataforma não reconhecer diretórios, configure explicitamente essa rota para `portfolio/index.html`. Teste acesso direto e recarga em ambos os caminhos antes de publicar. Não substitua rotas existentes por um fallback geral.

Canonical e Open Graph usam `https://www.aquilatechnology.com.br/portfolio/`; confirme o domínio canônico com o responsável pela hospedagem. O robots.txt existente permite indexação e foi preservado. A página pública pode ser indexada; não foram criadas páginas individuais, rotas privadas ou conexões com bancos. O catálogo não suporta conteúdo remoto fornecido pelo visitante. Links externos aceitam apenas HTTPS sem credenciais; conteúdo textual é inserido via textContent. Não há iframe sem verificação prévia de permissão e cabeçalhos do destino. SVG local é usado como placeholder; algumas redes sociais podem exigir imagem PNG para a prévia.

## Conteúdo aprovado por evidência local

- **Aquila PDV — Produto:** disponibilidade e recursos descritos em `pdv.html`. Sem demo ou repositório verificados; stack não divulgada. Usa ilustração neutra, sem republicar capturas operacionais. Para imagens reais, confirmar dados sintéticos e autorização.
- **Site institucional Aquila — Projeto institucional:** código deste repositório comprova tecnologias, páginas e formulário. Link local para o projeto; não é apresentado como case de cliente.

Esses dois registros podem compor o catálogo após a revisão editorial habitual do responsável. Não há evidências suficientes para publicar Dashboard de Inteligência Logística, Comparador de Dados Python ou Site Institucional de Advocacia. Pendem documentação, estágio, tecnologias, recursos e autorização. Aquila Management System é interno e foi excluído do catálogo público; não foram acessados arquivos, credenciais, funcionalidades administrativas ou banco desse sistema.

O formulário original e `pdv.html` usam um número de WhatsApp diferente do contato textual da home. Essa divergência preexistente foi preservada; o novo CTA aponta para `/index.html#contato`. Confirmar o número correto antes de uma correção independente.

## Adicionar projeto

Edite `src/data/projects.json` com um novo objeto baseado nos existentes. Use ID e slug únicos, título, resumo, descrição, categoria (`Websites`, `Sistemas`, `Automações`, `Dados e IA`), lista de tecnologias comprovadas, status verdadeiro, problema, solução e funcionalidades documentadas. `evidence` registra arquivos públicos de suporte. O filtro `Todos` é automático.

Somente registros com `visibility: "public"` são renderizados. **O JSON inteiro é um arquivo público**: nunca adicione segredos ou descrições internas, mesmo com outra visibilidade. Mantenha candidatos e pendências fora desse arquivo.

Imagens podem estar em `/src/img/` ou `/portfolio/img/`; codifique espaços e acentos no caminho da URL e preencha `imageAlt`. O campo opcional `gallery` recebe objetos com `src` e `alt` e exibe as capturas nos detalhes, com links para ampliação. Sem material autorizado, use `/src/img/portfolio-placeholder.svg`. Use `null` para `demoUrl`, `repositoryUrl` e `caseStudyUrl` ausentes; nunca invente URLs. URLs precisam ser HTTPS ou caminhos locais seguros. Verifique destino, autorização de publicação e ausência de dados reais antes de cadastrar links. Demonstrações abrem em nova aba protegida. Sem demo, o botão fica desabilitado e há explicação. Execute os testes e revise teclado, mobile e links ao atualizar.

## Resultados de validação

- 6 testes automatizados de catálogo, busca combinada, categorias, acentos, URLs perigosas, ausência de demo, dados inválidos e exclusão de registros internos: aprovados.
- Chrome headless: rota `/portfolio` com redirecionamento e recarga, seleção por Enter e foco no título, busca/categorias, vazio, demo desabilitada, falha HTTP e nova tentativa, JSON incompleto e menu com Escape: aprovados.
- Larguras 360, 390, 768, 1024 e 1440 px: sem overflow horizontal. Verificação visual de desktop e mobile realizada.
- Sete páginas originais carregadas sem erros JS, todos os recursos/links locais das oito páginas encontrados. Comparação com Git confirmou que o único ajuste nas páginas anteriores é o link de navegação.
- Sintaxe JS, `git diff --check` e empacotamento estático: aprovados.

Para repetir a verificação de navegador, com o servidor local em 4173 e Chrome instalado, instale Playwright em um diretório temporário (somente ferramenta de teste, sem alterar dependências do site):

```sh
npm install --prefix /tmp/aquila-browser-qa --no-audit --no-fund playwright
NODE_PATH=/tmp/aquila-browser-qa/node_modules node tests/portfolio.browser.cjs
```

Defina `BROWSER_EXECUTABLE` se o Chrome estiver em outro caminho. A verificação foi local; não substitui teste na hospedagem, auditoria completa com leitores de tela, validação de todas as integrações externas ou aprovação editorial. Não há demonstrações externas verificadas. Nenhum dado privado foi acrescentado ao catálogo.

## Capturas adicionadas ao catálogo

As 21 imagens fornecidas em `portfolio/img/` estão organizadas em quatro novos registros: modelo de site institucional, cardápio digital, landing page de advocacia e landing page de padaria. São apresentados como modelos demonstrativos, com capa e galeria, sem atribuição de tecnologias ou links de demonstração não fornecidos. Essa atualização substitui a pendência anterior relativa às capturas de advocacia.
