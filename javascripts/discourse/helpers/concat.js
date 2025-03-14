import { helper } from "@ember/component/helper";

/**
 * Helper para concatenar strings
 * @param {Array} params - Array de strings para concatenar
 * @returns {String} - String concatenada
 */
export default helper(function concat(params) {
  return params.join("");
}); 