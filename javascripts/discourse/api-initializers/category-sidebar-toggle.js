import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "category-sidebar-toggle",
  initialize() {
    withPluginApi("0.8.7", (api) => {
      api.onPageChange(() => {
        const sidebarCategories = document.querySelectorAll('.sidebar-section-link-wrapper[data-category-id]');
        
        const categoryRelations = new Map();
        
        // Primeiro passo: Identificar todas as subcategorias pelo padrão do href
        for (const category of sidebarCategories) {
          const link = category.querySelector('a');
          const href = link?.getAttribute('href');
          
          if (!href) continue;
          
          // Padrão de subcategoria: /c/categoria-pai/subcategoria/id
          const parts = href.split('/').filter(Boolean);
          
          if (parts.length > 3) { // É uma subcategoria
            const parentSlug = parts[1]; // nome da categoria pai
            
            // Adiciona classe no wrapper ao invés do link
            category.classList.add('is-subcategory-wrapper');
            
            // Encontrar a categoria pai pelo slug no href
            const parentCategory = Array.from(sidebarCategories).find(cat => {
              const parentHref = cat.querySelector('a')?.getAttribute('href');
              if (!parentHref) return false;
              const parentParts = parentHref.split('/').filter(Boolean);
              return parentParts.length === 3 && parentParts[1] === parentSlug;
            });
            
            if (!parentCategory) continue;
            
            const parentId = parentCategory.dataset.categoryId;
            
            if (!categoryRelations.has(parentId)) {
              categoryRelations.set(parentId, []);
            }
            
            categoryRelations.get(parentId).push(category);
            
            // Garante que a subcategoria sempre fique visível
            category.style.display = '';
          }
        }
      });
    });
  },
}; 