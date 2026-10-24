Data: 23/10/2026 (America/Sao_Paulo). Base: commit `de7b7b1`. Branch: `audit/aquila-diagnostico-2026-10-23`. Etapa A/B: diagnóstico e proposta; nenhuma correção de aplicação autorizada nesta etapa.

# Performance — linha de base

Lighthouse 13.5.0, Chrome headless instalado, preset mobile padrão, throttling simulado, servidor Python local na porta 4173, fonte original sem build/minificação. Uma execução por rota; auditorias iniciadas em paralelo no mesmo host, portanto valores exploratórios sujeitos a contenção. Não representar como mediana estável ou resultado de produção. Após aprovação, repetir sequencialmente com múltiplas amostras e mesmas condições. Configuração, user agent e auditorias completas nos JSON em evidencias/.

| Página | Performance antes | FCP | LCP | CLS | TBT | Speed Index | Transferência observada | Requisições | Depois |
|---|---|---|---|---|---|---|---|---|---|
| Home | 67 | 3.08 s | 10.59 s | 0.000 | 0 ms | 4.36 s | 1,954,570 bytes | 12 | Pendente aprovação |
| Portfólio | 86 | 2.65 s | 3.36 s | 0.000 | 0 ms | 4.22 s | 1,504,570 bytes | 17 | Pendente aprovação |

INP não disponível: sem CrUX, RUM ou dados de campo. TBT não substitui INP. Metas LCP ≤2,5 s e performance ≥90 não foram atingidas nessas execuções; CLS ≤0,1 foi atendido. Acessibilidade/SEO automatizados marcaram 100 para ambas, sem garantir conformidade ou indexação.

| ID | Descrição / evidência | Impacto | Prioridade | Correção proposta | Status | Validação |
|---|---|---|---|---|---|---|
| PERF-01 | Fundo Futuristic Data Display.png: 1.376.848 bytes; styles.css .hero; Lighthouse image-delivery/LCP | Transferência e LCP altos na home | P1 | Substituir composição decorativa por hero sóbrio; se mantido, derivar imagem otimizada sem apagar original | Proposto | LCP 10,59 s nesta amostra |
| PERF-02 | Captura de padaria 626.088 bytes; várias imagens PNG, sem srcset/sizes | Downloads superiores ao necessário em telas pequenas | P1 | WebP/AVIF conforme legibilidade e tamanhos responsivos | Proposto | Inventário e Lighthouse |
| PERF-03 | CSS externo Google Fonts/jsDelivr e CSS global bloqueantes | FCP e cadeia crítica de rede | P2 | Selecionar pesos/ícones usados e avaliar hospedagem local | Proposto | Lighthouse render-blocking/network-dependency |
| PERF-04 | HTML tem imagens sem dimensões; galeria JS portfolio.js:28 não define dimensões | Risco de deslocamento em outros cenários | P2 | Reservar proporção real por ativo | Proposto | CLS medido zero não exclui risco |
| PERF-05 | Overrides e CSS global para todas as páginas | Manutenção e CSS não utilizado por rota | P2 | Consolidar regras; separar só quando necessário | Proposto | Auditoria unused CSS na home |

Scripts defer, ausência de frameworks e TBT zero indicam que uma migração de arquitetura não se justifica por esses dados. Lazy loading já existe em capturas; não aplicar lazy indiscriminadamente a imagens de LCP. Inter usa display=swap e preconnect. Não foi produzida cobertura exaustiva de CSS não utilizado; regras sem uso numa rota podem ser necessárias em outra.

Transferência local não tem comportamento de compressão/cache/CDN da Cloudflare. Números incluem apenas recursos solicitados durante auditoria, não todas as galerias após interações/rolagem. Peso de saída do build e tamanho do repositório são grandezas diferentes. Não há métricas depois porque nenhum código foi alterado.
