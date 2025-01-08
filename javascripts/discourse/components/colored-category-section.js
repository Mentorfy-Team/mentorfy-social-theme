import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { action } from "@ember/object";

export default class ColoredCategorySection extends Component {
  @service router;
  @service siteSettings;
  @service site;

  get categories() {
    return this.args.sectionModel?.categories || [];
  }

  @action
  navigateToCategory(category) {
    this.router.transitionTo("discovery.category", category.slug);
  }
} 