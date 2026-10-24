# Diagnóstico e plano — redesign corporativo

Data: 23/10/2026. Ponto de restauração Git: `3b9548f` (inclui auditoria e preferências anteriores). Arquitetura: oito páginas HTML, CSS global/portfólio/consentimento, JavaScript nativo, build Python. Sem framework ou dependências npm de aplicação. Rotas, formulário WhatsApp, seis projetos e consentimento serão preservados. Inventário detalhado permanece em docs/auditoria/01-diagnostico.md.

Diferenças a tratar: interface atual inteiramente escura, imagem decorativa futurista de 1,37 MB, efeitos de perspectiva e brilho, regras CSS sobrepostas, rodapé reduzido e categorias de portfólio sem conteúdo. Google Fonts e fonte inteira de ícones geram requisições externas. Não há razão para migrar de arquitetura.

Referência consultada: https://stefanini.com/pt/ — navegação por soluções, serviços e conteúdos com contato destacado. Extraímos princípios de hierarquia e apresentação; nenhum ativo ou texto será copiado. A paleta vermelho #E30613, preto #111111, branco #FFFFFF e cinzas #F5F5F5/#333333 vem do briefing do usuário; não é atribuída automaticamente à referência. Evidência visual e cores computadas em evidencias/referencia* quando acessíveis.

Plano autorizado pelo novo briefing: (1) tokens e CSS consolidado; (2) navegação compartilhada com submenus nativos e foco; (3) hero editorial com foto de ambiente de trabalho; (4) serviços, produto e projetos; (5) portfólio com capturas reais e rótulos de modelos; (6) rodapé completo; (7) responsividade, testes e comparação Lighthouse. Tipografia de sistema evita dependências de fonte; ícones existentes serão mantidos nesta etapa. Fonte externa Google será removida, com atualização factual dos avisos de privacidade.

Sem excluir arquivos originais, mudar URLs, deploy, DNS ou credenciais. Logo oficial preservado, com derivados WebP otimizados. Foto de banco de imagens será identificada como ilustrativa e não como equipe/instalação própria. Não adicionar serviços sem respaldo (chatbot permanece em desenvolvimento; cibersegurança não será inventada). Números de WhatsApp divergentes continuam pendentes de confirmação; não escolher arbitrariamente destinatário.

Riscos/validação: cascata e contraste após tema claro, foco e submenus no mobile, funções de filtro/galeria, CSP e hash JSON-LD, formulário sem transmissão em testes, links e arquivos de build. Testar oito rotas nas sete larguras solicitadas e medições sequenciais antes/depois. Métricas de laboratório não equivalem a INP de campo.
