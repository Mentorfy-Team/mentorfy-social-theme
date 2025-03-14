import Component from "@glimmer/component";
import { htmlSafe } from "@ember/template";
import { gt } from "truth-helpers";
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

  get isVideoUrl() {
    if (!this.topic.image_url) return false;
    
    // Usar a propriedade definida pelo inicializador, se disponível
    if (this.topic.has_video !== undefined) {
      return this.topic.has_video;
    }
    
    // Detecta se a URL da imagem é de um vídeo (YouTube, Vimeo, etc.)
    return (
      this.topic.image_url.includes("youtube.com") ||
      this.topic.image_url.includes("youtu.be") ||
      this.topic.image_url.includes("vimeo.com") ||
      this.topic.image_url.includes("video")
    );
  }

  get videoEmbedHtml() {
    if (!this.isVideoUrl) return "";
    
    // Usar a URL incorporada definida pelo inicializador, se disponível
    if (this.topic.video_embed_url) {
      return htmlSafe(`<iframe width="100%" height="100%" src="${this.topic.video_embed_url}" frameborder="0" allowfullscreen></iframe>`);
    }
    
    // Extrair o ID do vídeo do YouTube ou Vimeo
    let videoId = "";
    let embedHtml = "";
    
    if (this.topic.image_url.includes("youtube.com") || this.topic.image_url.includes("youtu.be")) {
      // Para YouTube
      if (this.topic.image_url.includes("youtube.com/watch?v=")) {
        videoId = this.topic.image_url.split("v=")[1].split("&")[0];
      } else if (this.topic.image_url.includes("youtu.be/")) {
        videoId = this.topic.image_url.split("youtu.be/")[1].split("?")[0];
      }
      
      if (videoId) {
        embedHtml = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
      }
    } else if (this.topic.image_url.includes("vimeo.com")) {
      // Para Vimeo
      videoId = this.topic.image_url.split("vimeo.com/")[1].split("?")[0];
      
      if (videoId) {
        embedHtml = `<iframe width="100%" height="100%" src="https://player.vimeo.com/video/${videoId}" frameborder="0" allowfullscreen></iframe>`;
      }
    }
    
    return htmlSafe(embedHtml);
  }

  <template>
    <div class="tli-middle-section">
      {{#if this.topic.hasExcerpt}}
        <div class="topic-excerpt topic-excerpt-extended">
          <a href={{this.topic.url}} class="topic-excerpt-link">
            {{dirSpan this.topic.escapedExcerpt htmlSafe="true"}}
            {{#if this.topic.excerptTruncated}}
              <span class="topic-excerpt-more">{{i18n "read_more"}}</span>
            {{/if}}
          </a>
        </div>
      {{/if}}
      {{#if this.topic.image_url}}
        <a href="{{this.topic.lastUnreadUrl}}">
          <div class="topic-image">
            {{#if this.isVideoUrl}}
              <div class="topic-video-embed">{{{this.videoEmbedHtml}}}</div>
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
