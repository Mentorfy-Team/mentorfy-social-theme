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

## Solução de Problemas

Se as alterações não aparecerem imediatamente:

1. **Limpe o cache do navegador**: Pressione Ctrl+F5 ou Cmd+Shift+R para recarregar a página sem usar o cache
2. **Verifique a ativação do tema**: Certifique-se de que o tema esteja ativo nas configurações do Discourse
3. **Recompile o tema**: No painel de administração, vá até Customize > Themes, selecione o tema e clique em "Rebuild CSS/HTML"
4. **Reinicie o servidor Discourse**: Se você tiver acesso administrativo ao servidor, reinicie-o para garantir que as alterações sejam aplicadas

Para testar se as funcionalidades estão funcionando:

1. Crie um novo tópico com um texto longo (mais de 500 palavras)
2. Adicione um vídeo do YouTube ou Vimeo ao tópico
3. Após criar o tópico, veja como ele aparece na lista de tópicos

## Compatibilidade

Este tema é compatível com Discourse 3.0 ou superior.

---

Desenvolvido para Mentorfy por [Sua Equipe]