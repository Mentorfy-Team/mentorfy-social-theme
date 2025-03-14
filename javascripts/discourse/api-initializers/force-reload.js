import { apiInitializer } from "discourse/lib/api";

export default apiInitializer("1.8.0", (api) => {
  // Isso força o recarregamento da página quando o tema é ativado
  // mas apenas uma vez por sessão
  if (!localStorage.getItem("mentorfy-theme-reloaded")) {
    localStorage.setItem("mentorfy-theme-reloaded", "true");
    
    // Esperar um momento para garantir que a interface tenha carregado
    setTimeout(() => {
      // Recarregar apenas se estiver na página de tópicos
      if (window.location.pathname.includes("/latest") || 
          window.location.pathname.includes("/top") || 
          window.location.pathname.includes("/categories") || 
          window.location.pathname.includes("/c/")) {
        window.location.reload();
      }
    }, 2000);
  }
}); 