import { registerHelper } from "discourse-common/lib/helpers";

// Helper para verificar se uma string contém outra string
registerHelper("includes", function(str, substring) {
  if (!str || typeof str !== "string") return false;
  return str.includes(substring);
});

// Helper para verificar se uma string termina com outra string
registerHelper("ends-with", function(str, suffix) {
  if (!str || typeof str !== "string") return false;
  return str.endsWith(suffix);
});

// Helper para dividir uma string e obter uma parte específica
registerHelper("split-string", function(str, separator, options) {
  if (!str || typeof str !== "string") return str;
  
  const parts = str.split(separator);
  
  if (options && options.hash) {
    const { first, second } = options.hash;
    
    if (first && second && parts.length >= 2) {
      return parts[1];
    }
  }
  
  return parts[0];
});

// Helper para verificação lógica AND
registerHelper("and", function(...args) {
  // Remove o último argumento (options)
  const options = args.pop();
  
  // Verifica se todos os argumentos são verdadeiros
  return args.every(Boolean);
}); 