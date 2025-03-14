import { apiInitializer } from "discourse/lib/api";
import { withPluginApi } from "discourse/lib/plugin-api";

export default apiInitializer("1.8.0", (api) => {
  withPluginApi("0.8.7", (api) => {
    api.modifyClass("model:topic", {
      pluginId: "topic-excerpt-length",
      
      // Sobrescrever a propriedade excerptTruncated para permitir mais palavras antes de truncar
      get excerptTruncated() {
        const truncateLength = 1000; // Número de palavras antes de truncar
        if (!this.excerpt) return false;
        
        const excerptWords = this.excerpt.split(/\s+/);
        return excerptWords.length > truncateLength;
      },
      
      // Sobrescrever a propriedade escapedExcerpt para retornar um resumo mais longo
      get escapedExcerpt() {
        const excerpt = this.excerpt || "";
        const truncateLength = 1000; // Número de palavras antes de truncar
        
        const excerptWords = excerpt.split(/\s+/);
        if (excerptWords.length <= truncateLength) {
          return excerpt;
        }
        
        // Retornar as primeiras 1000 palavras com uma elipse
        return excerptWords.slice(0, truncateLength).join(" ") + "...";
      }
    });
  });
}); 