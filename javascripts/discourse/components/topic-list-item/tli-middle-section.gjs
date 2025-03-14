import Component from "@glimmer/component";
import { htmlSafe } from "@ember/template";
import { gt } from "truth-helpers";
import { and } from "discourse/theme-2/discourse/helpers/string-helpers";
import concatClass from "discourse/helpers/concat-class";
import icon from "discourse/helpers/d-icon";
import number from "discourse/helpers/number";
import UserLink from "discourse/components/user-link";
import avatar from "discourse/helpers/avatar";
import formatDate from "discourse/helpers/format-date";
import dirSpan from "discourse/helpers/dir-span";
import replaceEmoji from "discourse/helpers/replace-emoji";
import i18n from "discourse-common/helpers/i18n";
import discourseTags from "discourse/helpers/discourse-tags";

export default class TliMiddleSection extends Component {
  
  get topic() {
    return this.args.outletArgs.topic;
  }

  get topicBackgroundStyle() {
    return htmlSafe(`background-image: url(${this.topic.image_url})`);
  }

  get shouldShowReadMore() {
    if (!this.topic.excerpt) return false;
    const limit = Number(settings.excerpt_character_limit) || 1000;
    return this.topic.excerpt.length > limit;
  }

  get formattedExcerpt() {
    if (!this.topic.excerpt) return "";
    const limit = Number(settings.excerpt_character_limit) || 1000;
    if (this.topic.excerpt.length <= limit) {
      return htmlSafe(this.topic.escapedExcerpt);
    } else {
      return htmlSafe(this.topic.excerpt.substring(0, limit) + "...");
    }
  }

  get isVideoUrl() {
    if (!this.topic.image_url) return false;
    const url = this.topic.image_url;
    return (
      url.includes("youtube.com") || 
      url.includes("youtu.be") || 
      url.includes("vimeo.com") ||
      url.endsWith(".mp4")
    );
  }

  get videoEmbedHtml() {
    if (!this.isVideoUrl) return "";
    
    const url = this.topic.image_url;
    
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      // Extrair ID do YouTube
      let videoId = "";
      if (url.includes("youtube.com/watch?v=")) {
        videoId = url.split("v=")[1].split("&")[0];
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
      }
      
      if (videoId) {
        return htmlSafe(`<iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`);
      }
    } else if (url.includes("vimeo.com")) {
      // Extrair ID do Vimeo
      const vimeoId = url.split("vimeo.com/")[1].split("?")[0];
      if (vimeoId) {
        return htmlSafe(`<iframe width="100%" height="315" src="https://player.vimeo.com/video/${vimeoId}" frameborder="0" allowfullscreen></iframe>`);
      }
    } else if (url.endsWith(".mp4")) {
      return htmlSafe(`<video width="100%" height="315" controls><source src="${url}" type="video/mp4"></video>`);
    }
    
    return "";
  }

  <template>
    <div class="tli-middle-section">
      {{#if this.topic.hasExcerpt}}
        <div class="topic-excerpt">
          <a href={{this.topic.url}} class="topic-excerpt-link">
            {{dirSpan this.formattedExcerpt htmlSafe="true"}}
            {{#if this.shouldShowReadMore}}
              <span class="topic-excerpt-more">{{i18n "read_more"}}</span>
            {{/if}}
          </a>
        </div>
      {{/if}}
      {{#if this.topic.image_url}}
        <a href="{{this.topic.lastUnreadUrl}}">
          <div class="topic-image">
            {{#if (and this.isVideoUrl settings.embed_video_in_list)}}
              <div class="topic-video-embed">
                {{{this.videoEmbedHtml}}}
              </div>
            {{else}}
              {{#if settings.topic_image_backdrop}}
                <div class="topic-image__backdrop" style={{this.topicBackgroundStyle}} loading="lazy"></div>
              {{/if}}
              <img src="{{this.topic.image_url}}" class="topic-image__img" loading="lazy">
            {{/if}}
          </div>
        </a>
      {{/if}}
      {{discourseTags this.topic mode="list" tagsForUser=@tagsForUser}}
    </div>
  
    <div class="tli-bottom-section">
      {{#if (gt this.topic.like_count 0)}}
        <a href="{{this.topic.lastUnreadUrl}}" class="likes likes-tlist">
          {{number this.topic.like_count}}
          {{icon "heart"}}
        </a>
      {{/if}}

      <a href="{{this.topic.lastUnreadUrl}}" class={{concatClass "num views" this.topic.viewsHeat}}>
        {{number this.topic.views numberKey="views_long"}} {{icon "far-eye"}}
      </a>
  
      <UserLink
        @user={{this.topic.lastPosterUser}}
        class="latest-poster-tlist"
      >
        {{avatar this.topic.lastPosterUser imageSize="tiny"}}
      </UserLink>
  
      <a 
        href="{{this.topic.lastPostUrl}}"
        class={{concatClass "latest-activity-tlist" this.topic.view.likesHeat}}
      >
        {{formatDate this.topic.bumpedAt format="tiny" noTitle="true"~}} {{icon "clock-rotate-left"}}
      </a>
  
      <a 
        href="{{this.topic.lastUnreadUrl}}"
        class={{concatClass "posts-map badge-posts" this.topic.view.likesHeat}}
        aria-label={{this.topic.view.title}}
      >
        {{number this.topic.replyCount noTitle="true"}} {{icon "far-comment"}}
      </a>
    </div>
  </template>
}
