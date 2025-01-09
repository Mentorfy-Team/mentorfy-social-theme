import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

export default class ColoredCategorySection extends Component {
  @service router;
  @service siteSettings;
  @service site;
  @tracked expandedCategories = new Set();

  get categoriesWithChildren() {
    const categories = this.args.sectionModel?.categories || [];
    const parentCategories = categories.filter(c => !c.parent_category_id);
    
    return parentCategories.map(category => ({
      ...category,
      subcategories: categories.filter(c => c.parent_category_id === category.id)
    }));
  }

  @action
  toggleSubcategories(categoryId, event) {
    event.preventDefault();
    event.stopPropagation();
    
    if (this.expandedCategories.has(categoryId)) {
      this.expandedCategories.delete(categoryId);
    } else {
      this.expandedCategories.add(categoryId);
    }
  }

  @action
  navigateToCategory(category, event) {
    if (event.target.closest(".toggle-subcategories")) {
      return;
    }
    this.router.transitionTo("discovery.category", category.slug);
  }

  isExpanded(categoryId) {
    return this.expandedCategories.has(categoryId);
  }
} 