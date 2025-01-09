import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "category-sidebar-toggle",
  initialize() {
    withPluginApi("0.8.7", (api) => {
      api.onPageChange(() => {
        console.log("🔍 Iniciando detecção de categorias...");
        const sidebarCategories = document.querySelectorAll('.sidebar-section-link-wrapper[data-category-id]');
        console.log("📋 Total de categorias encontradas:", sidebarCategories.length);
        
        const categoryRelations = new Map();
        
        // Primeiro passo: Identificar todas as subcategorias pelo padrão do href
        for (const category of sidebarCategories) {
          const link = category.querySelector('a');
          const href = link?.getAttribute('href');
          console.log("🔗 Analisando categoria com href:", href);
          
          if (!href) continue;
          
          // Padrão de subcategoria: /c/categoria-pai/subcategoria/id
          const parts = href.split('/').filter(Boolean);
          console.log("📊 Partes do href:", parts);
          
          if (parts.length > 3) { // É uma subcategoria
            const parentSlug = parts[1]; // nome da categoria pai
            console.log("👆 Identificada subcategoria. Categoria pai:", parentSlug);
            
            // Encontrar a categoria pai pelo slug no href
            const parentCategory = Array.from(sidebarCategories).find(cat => {
              const parentHref = cat.querySelector('a')?.getAttribute('href');
              if (!parentHref) return false;
              const parentParts = parentHref.split('/').filter(Boolean);
              return parentParts.length === 3 && parentParts[1] === parentSlug;
            });
            
            if (!parentCategory) {
              console.log("⚠️ Categoria pai não encontrada para:", href);
              continue;
            }
            
            const parentId = parentCategory.dataset.categoryId;
            console.log("✅ Categoria pai encontrada, ID:", parentId);
            
            if (!categoryRelations.has(parentId)) {
              categoryRelations.set(parentId, []);
              console.log("📝 Criando nova relação para categoria pai:", parentId);
              
              // Add toggle button if not exists
              if (!parentCategory.querySelector('.category-toggle')) {
                console.log("➕ Adicionando botão toggle para categoria:", parentId);
                const toggleBtn = document.createElement('button');
                toggleBtn.className = 'category-toggle';
                toggleBtn.innerHTML = '<svg class="fa d-icon d-icon-angle-down svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#angle-down"></use></svg>';
                toggleBtn.style.cssText = 'background: none; border: none; padding: 0 5px; cursor: pointer;';
                
                const linkContent = parentCategory.querySelector('.sidebar-section-link-content-text');
                if (linkContent) {
                  linkContent.parentNode.insertBefore(toggleBtn, linkContent);
                  
                  // Restore state from localStorage
                  const isCollapsed = localStorage.getItem(`category-${parentId}-collapsed`) === 'true';
                  console.log("💾 Estado restaurado para categoria:", parentId, "collapsed:", isCollapsed);
                  if (isCollapsed) {
                    toggleBtn.classList.add('collapsed');
                    toggleBtn.style.transform = 'rotate(-90deg)';
                  }
                }
              }
            }
            
            categoryRelations.get(parentId).push(category);
            console.log("🔗 Adicionada relação: pai", parentId, "-> filho:", category.dataset.categoryId);
            
            // Apply initial state
            const isCollapsed = localStorage.getItem(`category-${parentId}-collapsed`) === 'true';
            if (isCollapsed) {
              category.style.display = 'none';
              console.log("👻 Escondendo subcategoria:", category.dataset.categoryId);
            }
          }
        }
        
        console.log("📊 Relações finais:", Object.fromEntries(categoryRelations));
        
        // Add click handlers
        for (const toggle of document.querySelectorAll('.category-toggle')) {
          if (!toggle.hasClickHandler) {
            toggle.hasClickHandler = true;
            toggle.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              
              const parentCategory = toggle.closest('.sidebar-section-link-wrapper');
              const parentId = parentCategory?.dataset.categoryId;
              if (!parentId) return;
              
              console.log("🖱️ Click no toggle da categoria:", parentId);
              const isCollapsed = toggle.classList.toggle('collapsed');
              localStorage.setItem(`category-${parentId}-collapsed`, isCollapsed);
              toggle.style.transform = isCollapsed ? 'rotate(-90deg)' : '';
              
              const children = categoryRelations.get(parentId) || [];
              console.log("🔄 Alterando visibilidade de", children.length, "subcategorias");
              for (const child of children) {
                child.style.display = isCollapsed ? 'none' : '';
              }
            });
          }
        }
      });
    });
  },
}; 