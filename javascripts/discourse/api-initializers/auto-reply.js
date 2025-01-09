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

      const checkAndOpenReply = () => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('reply') === 'true') {
          setTimeout(openReplyComposer, 500);
        }
      };

      // Handle initial load
      checkAndOpenReply();

      // Handle URL changes
      api.onAppEvent('page:changed', checkAndOpenReply);
    });
  },
}; 