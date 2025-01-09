import { withPluginApi } from "discourse/lib/plugin-api";
import { REPLY } from "discourse/models/composer";

export default {
  name: "auto-reply",
  initialize() {
    withPluginApi("0.8.31", (api) => {
      const openReplyComposer = () => {
        const composer = api.container.lookup("controller:composer");
        const topicController = api.container.lookup("controller:topic");

        if (topicController) {
          const topic = topicController.get("model");
          if (topic) {
            composer.open({
              action: REPLY,
              draftKey: topic.draft_key,
              draftSequence: topic.draft_sequence,
              topic,
            });
          }
        }
      };

      // Handle initial load with #reply
      if (window.location.hash === "#reply") {
        setTimeout(openReplyComposer, 500);
      }

      // Handle hash changes to #reply
      window.addEventListener("hashchange", (e) => {
        if (window.location.hash === "#reply") {
          setTimeout(openReplyComposer, 500);
        }
      });
    });
  },
}; 