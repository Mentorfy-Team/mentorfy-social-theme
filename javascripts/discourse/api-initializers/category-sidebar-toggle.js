import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "category-sidebar-toggle",
  initialize() {
    withPluginApi("0.8.7", (api) => {
      api.onPageChange(() => {
        const sidebarCategories = document.querySelectorAll('.sidebar-section-link-wrapper[data-category-id]');
        const categoryRelations = new Map();
        
        for (const category of sidebarCategories) {
          const prefixSpan = category.querySelector('.prefix-span');
          const gradient = prefixSpan?.style?.background;
          
          if (!gradient?.includes('linear-gradient')) continue;
          
          // Extract colors more safely
          const colorMatches = gradient.match(/#[A-Fa-f0-9]{6}/g);
          if (!colorMatches?.length) continue;
          
          const [firstColor] = colorMatches;
          if (!firstColor) continue;

          // Find parent category by matching the first color
          const parentCategory = Array.from(sidebarCategories).find(cat => {
            const catPrefixSpan = cat.querySelector('.prefix-span');
            return catPrefixSpan?.style?.background?.includes(`${firstColor} 50%`);
          });
          
          if (!parentCategory) continue;
          
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
              if (linkContent) {
                linkContent.parentNode.insertBefore(toggleBtn, linkContent);
                
                // Restore state from localStorage
                const isCollapsed = localStorage.getItem(`category-${parentId}-collapsed`) === 'true';
                if (isCollapsed) {
                  toggleBtn.classList.add('collapsed');
                  toggleBtn.style.transform = 'rotate(-90deg)';
                }
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
              
              const isCollapsed = toggle.classList.toggle('collapsed');
              localStorage.setItem(`category-${parentId}-collapsed`, isCollapsed);
              toggle.style.transform = isCollapsed ? 'rotate(-90deg)' : '';
              
              const children = categoryRelations.get(parentId) || [];
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