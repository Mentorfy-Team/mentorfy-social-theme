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
import { inject as service } from "@ember/service";
import substr from "discourse/helpers/substr";
import concat from "discourse/helpers/concat";
import { isTesting } from "discourse-common/config/environment";
import { ifHelper } from "@ember/component/helper";

export default class TliMiddleSection extends Component {
  @service siteSettings;
  
  get topic() {
    return this.args.outletArgs.topic;
  }

  get topicBackgroundStyle() {
    return htmlSafe(`background-image: url(${this.topic.image_url})`);
  }

  get hasVideo() {
    // Verifica se a URL da imagem contém referências a vídeos (YouTube, Vimeo, etc)
    // ou se o conteúdo contém tags de vídeo
    return this.topic.image_url && 
      (this.topic.image_url.includes("youtube") || 
       this.topic.image_url.includes("vimeo") ||
       this.topic.has_video);
  }

  get videoUrl() {
    // Converte URL de thumbnail para URL de vídeo incorporável
    if (!this.topic.image_url) return null;
    
    // YouTube
    if (this.topic.image_url.includes("youtube")) {
      const videoId = this.extractYouTubeId(this.topic.image_url);
      if (videoId) {
        return htmlSafe(`https://www.youtube.com/embed/${videoId}`);
      }
    }
    
    // Vimeo
    if (this.topic.image_url.includes("vimeo")) {
      const videoId = this.extractVimeoId(this.topic.image_url);
      if (videoId) {
        return htmlSafe(`https://player.vimeo.com/video/${videoId}`);
      }
    }
    
    // Retorna a própria URL se não conseguir converter
    return this.topic.video_url || this.topic.image_url;
  }
  
  extractYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }
  
  extractVimeoId(url) {
    const regExp = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/;
    const match = url.match(regExp);
    return match ? match[5] : null;
  }
  
  get shouldShowReadMore() {
    // Mostra "leia mais" apenas se exceder 1000 caracteres
    if (!this.topic.excerpt) return false;
    return this.topic.excerpt.length > 1000;
  }

  <template>
    <div class="tli-middle-section">
      {{#if this.topic.hasExcerpt}}
        <div class="topic-excerpt">
          <a href={{this.topic.url}} class="topic-excerpt-link">
            {{#if this.shouldShowReadMore}}
              {{dirSpan (htmlSafe (concat (substr this.topic.escapedExcerpt 0 1000) "...")) }}
            {{else}}
              {{dirSpan this.topic.escapedExcerpt htmlSafe="true"}}
            {{/if}}
            {{#if this.shouldShowReadMore}}
              <span class="topic-excerpt-more">{{i18n "read_more"}}</span>
            {{/if}}
          </a>
        </div>
      {{/if}}
      
      {{#if this.hasVideo}}
        <a href="{{this.topic.lastUnreadUrl}}">
          <div class="topic-video">
            <iframe 
              src="{{this.videoUrl}}" 
              frameborder="0" 
              allowfullscreen 
              class="topic-video__iframe" 
              loading="lazy">
            </iframe>
          </div>
        </a>
      {{else if this.topic.image_url}}
        <a href="{{this.topic.lastUnreadUrl}}">
          <div class="topic-image">
            {{#if settings.topic_image_backdrop}}
              <div class="topic-image__backdrop" style={{this.topicBackgroundStyle}} loading="lazy"></div>
            {{/if}}
            <img src="{{this.topic.image_url}}" class="topic-image__img" loading="lazy">
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
