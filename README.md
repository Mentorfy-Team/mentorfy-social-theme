# Mentorfy Social Theme para Discourse

Este tema para o Discourse implementa melhorias visuais e funcionais para a plataforma, incluindo:

## Recursos Principais

- **Excerpts Expandidos**: Permite mostrar até 1000 palavras do conteúdo do tópico na lista de tópicos
- **Incorporação de Vídeos**: Em vez de apenas mostrar thumbnails, exibe os vídeos incorporados diretamente na lista de tópicos
- **Detecção Automática**: Identifica automaticamente links de vídeo (YouTube, Vimeo, etc.) e os trata adequadamente

## Configurações

No arquivo `settings.yml` você pode personalizar:

- `excerpt_word_limit`: Número máximo de palavras a serem exibidas no excerpt (padrão: 1000)
- `topic_image_height`: Altura da seção de imagem/vídeo do tópico na lista
- `topic_image_fit`: Ajuste da imagem (contain, cover, scale-down, none)
- `topic_image_backdrop`: Habilitar efeito de fundo na imagem
- Diversas outras configurações visuais

## Instalação

1. No painel de administração do Discourse, acesse Customize > Themes
2. Clique em "Import" e escolha "From a git repository"
3. Insira a URL deste repositório
4. Ative o tema em seu site

## Compatibilidade

Este tema é compatível com Discourse 3.0 ou superior.

---

Desenvolvido para Mentorfy por [Sua Equipe]