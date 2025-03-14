import { withPluginApi } from "discourse/lib/plugin-api";
import "../helpers/string-helpers";

export default {
  name: "load-helpers",
  initialize() {
    withPluginApi("0.8.7", (api) => {
      // Os helpers já foram registrados ao importar o arquivo acima
      console.log("String helpers carregados para o tema Mentorfy Social Theme");
    });
  }
}; 