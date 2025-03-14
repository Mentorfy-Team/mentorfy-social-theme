import { apiInitializer } from "discourse/lib/api";
import { withPluginApi } from "discourse/lib/plugin-api";

export default apiInitializer("1.8.0", (api) => {
  // Modificar o limite de palavras do excerpt para o valor configurado no tema
  withPluginApi("0.8.31", (api) => {
    api.modifyClass("model:topic-list-item", {
      pluginId: "mentorfy-social-theme",
      
      // Sobrescrever o cálculo do excerpt para usar o limite de palavras configurado
      createExcerpt() {
        const excerptWordLimit = api.container.lookup("site:main").get("themeSettings.excerpt_word_limit") || 1000;
        
        if (this.excerpt && !this.get("excertProcessed")) {
          // Substitui o limite padrão de palavras (que geralmente é 200) pelo valor configurado
          const limit = excerptWordLimit;
          let excerpt = this.excerpt;
          excerpt = excerpt.replace(/(\r\n|\n|\r)/gm, " ");
          
          if (excerpt.length > limit) {
            excerpt = excerpt.substring(0, limit) + "...";
            this.set("excerptTruncated", true);
          }
          
          this.set("excertProcessed", true);
          this.set("escapedExcerpt", excerpt);
        }
        
        return this.excerpt;
      }
    });
    
    // Habilitar detecção de vídeos em URLs de imagens
    api.modifyClass("model:topic", {
      pluginId: "mentorfy-social-theme",
      
      // Identificar e marcar tópicos com conteúdo de vídeo
      setupProperties() {
        this._super(...arguments);
        
        if (this.image_url) {
          const isVideo = 
            this.image_url.includes("youtube.com") ||
            this.image_url.includes("youtu.be") ||
            this.image_url.includes("vimeo.com") ||
            this.image_url.includes("video");
          
          this.set("has_video", isVideo);
        }
      }
    });
  });
}); 