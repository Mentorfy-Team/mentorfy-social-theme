import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "colored-categories",
  initialize() {
    withPluginApi("0.8.7", (api) => {
      api.modifyClass("component:sidebar-section-link", {
        pluginId: "colored-categories",
        
        get sectionComponent() {
          return "colored-category-section";
        }
      });
    });
  },
}; 

