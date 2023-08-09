import "./Search.scss";
export default function Search() {
  return (
    <div class="search-component" style="line-height: var(--headerHeight); width:calc(100vw - 250px);max-width:600px;">
      <input type="text" placeholder="Search" style="width:100%;padding:0.4rem;border-radius:10px" />
    </div>
  );
}
