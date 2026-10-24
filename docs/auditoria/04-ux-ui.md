Data: 23/10/2026 (America/Sao_Paulo). Base: commit `de7b7b1`. Branch: `audit/aquila-diagnostico-2026-10-23`. Etapa A/B: diagnóstico e proposta; nenhuma correção de aplicação autorizada nesta etapa.

# UX/UI e direção corporativa

Avaliação heurística do código e capturas locais, sem pesquisa ou teste com usuários. Não atribuir resultados de conversão a esta inspeção.

Marca identificada: logos branco/preto existentes; azul-marinho #081123, superfícies #0f1a35, ciano #77d9ed, texto claro e Inter. Preservar logotipo e reconhecimento cromático. Não há justificativa para trocar identidade ou inventar credenciais.

| ID | Descrição / evidência | Impacto | Prioridade | Correção proposta | Status | Validação |
|---|---|---|---|---|---|---|
| UX-01 | Home reúne oito links e duplica entrada Projetos/Portfólio, index.html:61–69 | Jornada de descoberta fragmentada | P1 | Simplificar hierarquia mantendo destinos e âncoras existentes | Proposto | Heurística |
| UX-02 | Gradientes, radial glow, perspectiva e cards repetidos em styles.css .hero/.pdv-section/.product-preview | Direção visual difere do briefing corporativo | P1 | Hero editorial, superfícies sólidas, espaçamento e tipos bem hierarquizados; reduzir efeitos | Proposto | Código e capturas antes |
| UX-03 | src/js/portfolio-core.js:3 oferece Automações e Dados e IA sem entradas | Filtros levam a estados vazios evitáveis | P1 | Derivar categorias dos projetos públicos e distinguir landing pages quando comprovadas | Proposto | Teste unitário confirma categoria vazia |
| UX-04 | JSON usa placeholder para PDV e site próprio, apesar de capturas locais | Menor evidência visual de trabalho | P1 | Selecionar capturas reais; separar produto próprio e modelos, manter rótulos de status | Proposto | Catálogo e ativos conferidos |
| UX-05 | Painel detalhado fica após toda a lista no mobile, src/portfolio.css:40 | Exploração longa e contexto distante | P1 | Revisar seleção/foco/retorno à lista e galeria compacta sem novas rotas obrigatórias | Proposto | Requer teste de tarefa posterior |
| UX-06 | Blog anuncia Em breve, blog.html:56–63 | Destino sem conteúdo editorial | P3 | Reduzir destaque até haver artigos reais; preservar URL | Pendente conteúdo | Inspeção |
| UX-07 | Marca grafada Tecnology no HTML e Technology no briefing | Inconsistência editorial | P2 | Confirmar grafia oficial antes de normalizar texto e dados estruturados | Pendente comercial | Comparação documental |

Proposta para portfólio: introdução objetiva, categorias reais, projetos com captura/objetivo/solução/tecnologias confirmadas, demonstração apenas quando existente e CTA de orçamento. Não tratar modelos como clientes entregues. Stack ausente não será inferida das imagens. Não há material validado que justifique páginas individuais adicionais agora.

Lighthouse de acessibilidade obteve 100 nas duas rotas medidas, o que não comprova WCAG 2.2 AA. Há skip link, foco visível, labels, status aria-live, menu com Escape e preferência por movimento reduzido. Completar inspeção manual de contraste de todos os estados, zoom 200/400%, leitores de tela, alvos de toque, foco não encoberto e menu sem JS antes de declarar conformidade.
