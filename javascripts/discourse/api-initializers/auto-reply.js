import { withPluginApi } from "discourse/lib/plugin-api";
import { REPLY } from "discourse/models/composer";

export default {
  name: "auto-reply",
  initialize() {
    withPluginApi("0.8.31", (api) => {
      if (new URLSearchParams(window.location.search).get('reply') === 'true') {
        const composer = api.container.lookup("controller:composer");
        const topicController = api.container.lookup("controller:topic");

        if (topicController) {
          setTimeout(() => {
            const topic = topicController.get("model");
            if (topic) {
              composer.open({
                action: REPLY,
                draftKey: topic.draft_key,
                draftSequence: topic.draft_sequence,
                topic,
              });
            }
          }, 0);
        }
      }
    });
  },
}; 