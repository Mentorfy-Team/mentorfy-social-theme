import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { action } from "@ember/object";

export default class ColoredCategorySection extends Component {
  @service router;
  @service siteSettings;

  get categories() {
    return this.site.categories.filter((c) => !c.parent_category_id);
  }

  @action
  navigateToCategory(category) {
    this.router.transitionTo("discovery.category", category.slug);
  }
} 