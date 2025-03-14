import { apiInitializer } from "discourse/lib/api";
import { withPluginApi } from "discourse/lib/plugin-api";
import { helperContext } from "discourse-common/lib/helpers";

export default apiInitializer("1.8.0", (api) => {
  withPluginApi("0.8.31", (api) => {
    // Registrar modelo personalizado para excerpt
    api.modifyClass("component:topic-list", {
      pluginId: "mentorfy-social-theme",
      
      didInsertElement() {
        this._super(...arguments);
        
        // Substituir o modelo padrão de excerpt pelo nosso personalizado
        const container = helperContext().container;
        const topicExcerptTemplate = container.lookup("template:list/mentorfy-topic-excerpt");
        
        if (topicExcerptTemplate) {
          container.register("template:list/topic-excerpt", topicExcerptTemplate);
        }
      }
    });
  });
}); 