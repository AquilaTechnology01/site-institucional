# Diagnóstico anterior aos ajustes

Ponto de restauração: `006b523`, preservando todo o redesign local anterior. Sem push. Inspeção da árvore, oito HTML, CSS compartilhados, scripts e build Python existentes; arquitetura multipágina nativa confirmada.

## Logotipo

Arquivos oficiais presentes: src/img/logo/logo-preto.png (1600×1600), logo-branco.png (612×408) e favicon.png. Derivados WebP já existem, versionados e presentes em dist/src/img/optimized. Sem variação de caixa ou caminho divergente entre páginas. As versões preta/branca representam o mesmo símbolo, adequadas aos fundos claro/escuro; não há um azul oficial identificável nesses arquivos monocromáticos.

Margem transparente: preto tem conteúdo em (328,411)–(1270,1105); branco em (80,17)–(532,351). Renderizar o canvas inteiro reduz visualmente o símbolo. Os derivados existentes já recortam essa margem, mas os tamanhos CSS de 53×48 px (42×40 no mobile) deixam o símbolo pequeno; a caixa tem proporção diferente do desenho, embora object-fit:contain evite distorção.

Inspeção pública por Chrome: home https://aquilatechnology.com.br/ e portfólio https://www.aquilatechnology.com.br/portfolio/ responderam 200, exibem a versão antiga do HTML e referenciam src/img/logo/logo-branco.png. A imagem retornou HTTP 200, image/png, 85.603 bytes, naturalWidth 612; sem erros JS observados. CSS computado: display block, visibility visible, opacity 1, 72×48, object-fit contain, sem filter/clip-path, fundo escuro. Não foi reproduzido logotipo ausente nessas páginas. Não há evidência para atribuir uma falha inexistente a 404 ou build. Requisições independentes aos caminhos otimizados por urllib receberam 403; isso é limitação de acesso, não confirmação de arquivo ausente. Evidências em producao.json e producao-otimizados.json.

A divergência de versão publicada/local e a redução da área útil pelos canvases originais estão confirmadas. Não é possível afirmar a causa exata do episódio relatado sem sua ocorrência ou os dados daquele deploy. Corrigir a apresentação local e validar saída/URLs em navegador, sem inventar diagnóstico.

## Outros achados

- Alto: acentos vermelhos no CSS global, consentimento e theme-color, em desacordo com a nova identidade azul.
- Médio: campos não expõem aria-invalid/descritivo de erro individual; confirmação atual anuncia abertura sem distinguir envio efetivo, embora o WhatsApp só prepare uma mensagem.
- Médio: apenas home/portfólio possuem aria-current no cabeçalho; documentos e PDV não destacam destino atual.
- Médio: Escape de submenu no mobile também fecha o menu principal por dois listeners; melhorar fechamento em níveis e retorno de foco.
- Baixo: foto do hero e rodapé já responsivos; nenhuma rolagem indevida confirmada na auditoria anterior, mas ampliar testes para 430 e 1366 px e incluir validação explícita dos logos.

Plano: tokens azul centralizados, variantes oficiais com fallback PNG e proporção natural, navegação atual indicada em todas as rotas, feedback de formulário/foco, regressões e capturas nas nove larguras, axe e Lighthouse antes/depois. Nenhuma configuração de hospedagem, credencial, rota, projeto ou integração será removida.
