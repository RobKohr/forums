import { A } from "@solidjs/router";
import "./SearchResult.scss";
export default function SearchResult() {
  return (
    <div class="search-result-component">
      <A href="/test/example">
        <div class="members-only-lock emoji">🔒</div>
        <div class="result-icon-container">
          <img class="result-icon" src="/test/exampleIcon.png" />
        </div>
        <h4>Result title</h4>
        <div class="rating">87% positive</div>
        <div class="downloads-this-month" title="1000 downloads a month">
          1000 dl/m
        </div>
        <div class="short-description">A world building random generator</div>
      </A>
      <div class="tags">
        <A href="/tags/Fantasy">
          <span class="tag">Fantasy</span>
        </A>
        <A href="/tags/World Building">
          <span class="tag">World Building</span>
        </A>
        <A href="/tags/Random Generator">
          <span class="tag">Random Generator</span>
        </A>
      </div>
    </div>
  );
}
