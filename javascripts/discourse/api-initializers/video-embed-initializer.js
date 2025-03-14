import { apiInitializer } from "discourse/lib/api";
import { withPluginApi } from "discourse/lib/plugin-api";

export default apiInitializer("1.8.0", (api) => {
  withPluginApi("0.8.31", (api) => {
    // Função para identificar e converter URLs de vídeo
    const processTopicVideoUrls = function(topics) {
      if (!topics || topics.length === 0) return;

      topics.forEach(topic => {
        if (!topic || !topic.image_url) return;
        
        // Verificar se a imagem do tópico é uma URL de vídeo
        const isVideoUrl = 
          topic.image_url.includes("youtube.com") ||
          topic.image_url.includes("youtu.be") ||
          topic.image_url.includes("vimeo.com") ||
          topic.image_url.includes("video");
        
        // Marcar o tópico para processamento especial
        if (isVideoUrl) {
          topic.set("has_video", true);
          
          // Armazenar a URL do vídeo para incorporação
          if (topic.image_url.includes("youtube.com") || topic.image_url.includes("youtu.be")) {
            let videoId = "";
            
            if (topic.image_url.includes("youtube.com/watch?v=")) {
              videoId = topic.image_url.split("v=")[1].split("&")[0];
            } else if (topic.image_url.includes("youtu.be/")) {
              videoId = topic.image_url.split("youtu.be/")[1].split("?")[0];
            }
            
            if (videoId) {
              topic.set("video_embed_url", `https://www.youtube.com/embed/${videoId}`);
            }
          } else if (topic.image_url.includes("vimeo.com")) {
            const videoId = topic.image_url.split("vimeo.com/")[1].split("?")[0];
            
            if (videoId) {
              topic.set("video_embed_url", `https://player.vimeo.com/video/${videoId}`);
            }
          }
        }
      });
    };

    // Aumentar o limite de excerpt
    api.modifyClass("model:topic-list-item", {
      excerptLimit: 1000,
      
      createExcerpt() {
        if (!this.excerpt) return "";
        
        const limit = api.container.lookup("site:main").get("themeSettings.excerpt_word_limit") || 1000;
        let excerpt = this.excerpt;
        excerpt = excerpt.replace(/(\r\n|\n|\r)/gm, " ");
        
        if (excerpt.length > limit) {
          excerpt = excerpt.substring(0, limit) + "...";
          this.set("excerptTruncated", true);
        }
        
        this.set("escapedExcerpt", excerpt);
        return excerpt;
      }
    });

    // Processar tópicos quando a lista é carregada
    api.modifyClass("component:topic-list", {
      didReceiveAttrs() {
        this._super(...arguments);
        
        const topics = this.get("topics");
        if (topics) {
          processTopicVideoUrls(topics);
        }
      }
    });

    // Processar tópicos quando o modelo é carregado
    api.onAppEvent("page:topic-loaded", (data) => {
      if (data && data.model) {
        processTopicVideoUrls([data.model]);
      }
    });
  });
}); 