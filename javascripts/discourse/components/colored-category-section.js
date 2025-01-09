import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

export default class ColoredCategorySection extends Component {
  @service router;
  @service siteSettings;
  @service site;
  @tracked expandedCategories = new Set();

  constructor() {
    super(...arguments);
    // Inicializar o estado do localStorage
    const savedState = localStorage.getItem("category_expanded_state");
    if (savedState) {
      this.expandedCategories = new Set(JSON.parse(savedState));
    }
  }

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
    
    const newState = new Set(this.expandedCategories);
    if (newState.has(categoryId)) {
      newState.delete(categoryId);
    } else {
      newState.add(categoryId);
    }
    
    // Salvar estado no localStorage
    localStorage.setItem(
      "category_expanded_state", 
      JSON.stringify(Array.from(newState))
    );
    
    this.expandedCategories = newState;
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