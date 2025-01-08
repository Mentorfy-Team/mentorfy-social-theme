import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "colored-categories",
  initialize() {
    withPluginApi("0.8.7", (api) => {
      api.addSidebarSection((BaseCustomSidebarSection, BaseCustomSidebarSectionLink) => {
        return class ColoredCategoriesSection extends BaseCustomSidebarSection {
          get name() {
            return "categories";
          }

          get text() {
            return I18n.t("categories.title");
          }

          get actionsIcon() {
            return "pencil-alt";
          }

          get actions() {
            return [
              {
                id: "editCategories",
                title: I18n.t("categories.edit"),
                action: () => {
                  const router = this.container.lookup("service:router");
                  router.transitionTo("adminCategories");
                },
              },
            ];
          }

          get displaySection() {
            return true;
          }

          get links() {
            return [];
          }

          get component() {
            return "colored-category-section";
          }
        };
      });
    });
  },
}; 