import Lipsum from "../components/Lipsum";

export default function Home() {
  return (
    <div class="route-home">
      <div>Home</div>
      <Lipsum startingParagraphs={10} />
    </div>
  );
}
