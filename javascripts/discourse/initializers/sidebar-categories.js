import { withPluginApi } from "discourse/lib/plugin-api";
import { tracked } from "@glimmer/tracking";
import Component from "@glimmer/component";

export default {
  name: "sidebar-categories",
  initialize() {
    withPluginApi("0.8.7", (api) => {
      api.addSidebarSection((sidebar) => {
        const categories = sidebar.site.categories;
        
        // Organize categories and subcategories
        const topLevelCategories = categories.filter(c => !c.parent_category_id);
        const categoriesWithSubs = topLevelCategories.map(category => {
          return {
            ...category,
            subcategories: categories.filter(c => c.parent_category_id === category.id)
          };
        });

        return {
          component: "fkb-sidebar-categories",
          args: {
            categories: categoriesWithSubs
          },
          title: "Categories",
          classNames: ["sidebar-categories"]
        };
      });
    });
  }
}; 