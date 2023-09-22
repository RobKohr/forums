import Lipsum from "../../../components/Lipsum";

export default function Home() {
  return (
    <div class="route-home padded">
      <div>Home</div>
      <Lipsum startingParagraphs={10} />
    </div>
  );
}
