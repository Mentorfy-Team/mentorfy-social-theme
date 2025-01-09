import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

export default class FkbCategoryToggle extends Component {
  @tracked expandedCategories = new Set();

  @action
  toggleSubcategories(categoryId) {
    if (this.expandedCategories.has(categoryId)) {
      this.expandedCategories.delete(categoryId);
    } else {
      this.expandedCategories.add(categoryId);
    }
    
    // Toggle visibility class
    const subcategoriesEl = document.querySelector(`.subcategories-${categoryId}`);
    if (subcategoriesEl) {
      subcategoriesEl.classList.toggle("is-expanded");
    }
  }
} 