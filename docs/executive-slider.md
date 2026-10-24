# Aquila Executive — banner panorâmico

Atualizado em 24/10/2026 a partir da referência visual da Stefanini enviada pelo usuário. A nova direção substitui a composição anterior de texto/fotografia em duas colunas por um banner de largura total. Os textos e destinos dos botões foram mantidos; cores e enquadramento do hero foram adaptados à referência. Cabeçalho, demais seções e outras páginas mantêm o layout existente.

## Direção visual

- Fundo azul-marinho, título branco com destaque azul-claro e elementos geométricos à direita.
- Três composições originais: transformação digital (cubos translúcidos), sistemas de gestão (painel ilustrativo) e automação/integração (módulos conectados).
- Acentos dourados discretos, sem usar logotipos, campanhas ou imagens da Stefanini.
- Indicadores arredondados no canto inferior direito, com estado ativo alongado e progresso. Área clicável mínima de 44 px, foco visível e botão de pausa.
- No celular, o texto aparece acima das ilustrações, com espaço reservado para os controles e sem rolagem horizontal.

## Ativos

As ilustrações foram desenhadas em SVG no próprio projeto (`src/img/executive/*.svg`), sem dependências externas. São abstratas e não representam escritórios, funcionários, clientes ou infraestrutura real da Aquila. O painel de gestão é conceitual.

As páginas carregam somente as variantes WebP de 640, 1024 e 1600 px, geradas dos SVG por renderização local e redimensionamento Lanczos, qualidade 88. Os SVG são mantidos como fontes editáveis. As fotografias adicionadas exclusivamente para a primeira versão do slider foram substituídas; a fotografia de escritório preexistente no repositório permanece disponível em seu caminho original.

## Comportamento e acessibilidade

Crossfade de 900 ms, `ease-in-out`, a cada 7000 ms. A próxima imagem só aparece depois de decodificada; a anterior permanece opaca durante a transição. Falhas e atrasos de rede preservam a imagem atual. Seleções recentes prevalecem sobre respostas de seleções anteriores.

O zoom é sutil (1 → 1,025 em 16 segundos). A reprodução pausa por foco, ponteiro, aba oculta, popup de privacidade aberto e comando de pausa. Com movimento reduzido, ficam desativados autoplay, crossfade e zoom; os indicadores continuam permitindo seleção manual.

Tab/Enter/Espaço e setas esquerda/direita/Home/End nos indicadores. O slide ativo usa `aria-current`; os slides ocultos usam `aria-hidden`, sem anúncios automáticos. Sem JavaScript, a primeira ilustração continua visível e os controles ficam ocultos.

A primeira imagem tem prioridade alta. A segunda é preparada após o carregamento crítico (3 segundos depois de `window.load`, exceto com movimento reduzido, economia de dados ou aba oculta); a terceira só é solicitada quando necessária. Os templates impedem downloads iniciais das imagens secundárias.

CSS e JavaScript locais. CSP preservada. O build inclui o CSS no bundle exclusivo da home e o JS no mesmo bundle do formulário, sem aumentar o número de requisições iniciais de CSS/JS. Demais páginas usam seus bundles existentes.

## Verificação

```bash
python3 scripts/build.py
python3 tests/build_test.py
python3 tests/seo_test.py
node --test tests/portfolio.test.cjs
SITE_BASE=http://127.0.0.1:4181 node tests/executive-slider.browser.cjs
```

O teste do slider requer as ferramentas de desenvolvimento existentes (Playwright, Chrome e axe). Verifica autoplay, crossfade, teclado, foco, pausa, aba oculta simulada, movimento reduzido, 9 larguras × 3 composições, enquadramento do banner, acessibilidade, CSP, imagens indisponíveis/lentas, seleções concorrentes e fallback sem JS. Testes existentes de equivalência fonte/build, consentimento e segurança também são utilizados.

Não houve push, merge ou deploy nesta alteração.

## Desempenho local

Lighthouse mobile, uma execução local após a revisão visual: desempenho 100, LCP 1.66 s e CLS 0. Resultado de laboratório; não representa medição de produção ou INP de campo.
