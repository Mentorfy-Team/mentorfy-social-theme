# Instruções de Instalação e Ativação

Para garantir que as funcionalidades de excerpt expandido e incorporação de vídeos funcionem corretamente, siga as instruções abaixo:

## Instalação Inicial

1. No painel de administração do Discourse, acesse **Customize > Themes**
2. Clique em **Import** e escolha **From a git repository**
3. Insira a URL deste repositório
4. Ative o tema em seu site
5. Após a ativação, **reinicie o servidor Discourse** para garantir que todas as alterações sejam aplicadas

## Reativação após Atualizações

Sempre que atualizar o tema, siga estes passos para garantir que as alterações sejam aplicadas:

1. No painel de administração, vá até **Customize > Themes**
2. Selecione o tema **Mentorfy Social Theme**
3. Clique em **Actions > Rebuild CSS/HTML**
4. Depois, clique em **Actions > Disable**, aguarde alguns segundos e clique em **Actions > Enable**
5. Limpe o cache do navegador (Ctrl+F5 ou Cmd+Shift+R)

## Verificação de Funcionalidades

Para confirmar que as funcionalidades estão ativas:

### Excerpts Expandidos
1. Crie um tópico com texto longo (mais de 500 palavras)
2. Verifique se na lista de tópicos o texto aparece mais extenso do que o padrão do Discourse

### Incorporação de Vídeos
1. Crie um tópico que inclua um vídeo do YouTube ou Vimeo
2. Verifique se na lista de tópicos o vídeo aparece incorporado e reproduzível, em vez de apenas uma thumbnail

## Solução de Problemas Comuns

Se as funcionalidades não estiverem funcionando:

### Problema: Excerpts ainda estão truncados
- Verifique se o arquivo `javascripts/discourse/api-initializers/extended-excerpt.js` existe e está preenchido
- Certifique-se de que a configuração `excerpt_word_limit` no arquivo `settings.yml` está definida corretamente
- Reconstrua o CSS/HTML do tema e reinicie o servidor

### Problema: Vídeos não aparecem incorporados
- Verifique se o arquivo `javascripts/discourse/components/topic-list-item/tli-middle-section.gjs` foi modificado corretamente
- Certifique-se de que o arquivo `javascripts/discourse/api-initializers/video-embed-initializer.js` existe e está preenchido
- Reconstrua o CSS/HTML do tema e reinicie o servidor

### Problema: Estilos CSS não estão aplicados
- Verifique se o arquivo `scss/common/mentorfy-extended-excerpt.scss` existe e está preenchido
- Reconstrua o CSS/HTML do tema 