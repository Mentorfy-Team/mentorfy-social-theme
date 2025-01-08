import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "colored-categories",
  initialize() {
    withPluginApi("0.8.7", (api) => {
      api.modifyClass("discourse/components/sidebar/categories-section", {
        pluginId: "colored-categories",
        
        get sectionComponent() {
          return "colored-category-section";
        }
      });
    });
  },
}; 