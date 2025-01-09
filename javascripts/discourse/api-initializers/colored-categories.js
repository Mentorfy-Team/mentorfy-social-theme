import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "colored-categories",
  initialize() {
    withPluginApi("0.8.7", (api) => {
      api.modifyClass("component:sidebar-section-categories", {
        pluginId: "colored-categories",
        
        defaultComponentName: "colored-category-section"
      });
    });
  },
}; 

