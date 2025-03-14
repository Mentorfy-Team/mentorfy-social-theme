import { helper } from "@ember/component/helper";

/**
 * Helper para extrair uma substring de um texto
 * @param {Array} params - Array com [texto, início, comprimento]
 * @returns {String} - Substring do texto
 */
export default helper(function substr(params) {
  const [text, start, length] = params;
  
  if (!text) {
    return "";
  }
  
  if (typeof text !== "string") {
    return String(text).substring(start, length ? start + length : undefined);
  }
  
  return text.substring(start, length ? start + length : undefined);
}); 