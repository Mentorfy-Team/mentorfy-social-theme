import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "category-sidebar-toggle",
  initialize() {
    withPluginApi("0.8.7", (api) => {
      api.onPageChange(() => {
        const sidebarCategories = document.querySelectorAll('.sidebar-section-link-wrapper[data-category-id]');
        
        // Create a map of parent-child relationships
        const categoryRelations = new Map();
        
        sidebarCategories.forEach(category => {
          const gradient = category.querySelector('.prefix-span')?.style.background;
          if (gradient && gradient.includes('linear-gradient')) {
            const parentColor = gradient.match(/#[A-Fa-f0-9]{6}/g)[0];
            const parentCategory = Array.from(sidebarCategories)
              .find(cat => cat.querySelector('.prefix-span')?.style.background.includes(`${parentColor} 50%`));
            
            if (parentCategory) {
              const parentId = parentCategory.dataset.categoryId;
              if (!categoryRelations.has(parentId)) {
                categoryRelations.set(parentId, []);
                
                // Add toggle button if not exists
                if (!parentCategory.querySelector('.category-toggle')) {
                  const toggleBtn = document.createElement('button');
                  toggleBtn.className = 'category-toggle';
                  toggleBtn.innerHTML = '<svg class="fa d-icon d-icon-angle-down svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#angle-down"></use></svg>';
                  toggleBtn.style.cssText = 'background: none; border: none; padding: 0 5px; cursor: pointer;';
                  
                  const linkContent = parentCategory.querySelector('.sidebar-section-link-content-text');
                  linkContent.parentNode.insertBefore(toggleBtn, linkContent);
                  
                  // Restore state from localStorage
                  const isCollapsed = localStorage.getItem(`category-${parentId}-collapsed`) === 'true';
                  if (isCollapsed) {
                    toggleBtn.classList.add('collapsed');
                    toggleBtn.style.transform = 'rotate(-90deg)';
                  }
                }
              }
              categoryRelations.get(parentId).push(category);
              
              // Apply initial state
              const isCollapsed = localStorage.getItem(`category-${parentId}-collapsed`) === 'true';
              if (isCollapsed) {
                category.style.display = 'none';
              }
            }
          }
        });
        
        // Add click handlers
        document.querySelectorAll('.category-toggle').forEach(toggle => {
          if (!toggle.hasClickHandler) {
            toggle.hasClickHandler = true;
            toggle.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              
              const parentCategory = toggle.closest('.sidebar-section-link-wrapper');
              const parentId = parentCategory.dataset.categoryId;
              const isCollapsed = toggle.classList.toggle('collapsed');
              
              localStorage.setItem(`category-${parentId}-collapsed`, isCollapsed);
              
              toggle.style.transform = isCollapsed ? 'rotate(-90deg)' : '';
              
              const children = categoryRelations.get(parentId) || [];
              children.forEach(child => {
                child.style.display = isCollapsed ? 'none' : '';
              });
            });
          }
        });
      });
    });
  },
}; 