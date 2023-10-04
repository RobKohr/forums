import { useParams } from "@solidjs/router";

export default function Asset() {
  const params = useParams();
  axios.get('').then((response) => {

  console.log(params.id);

  return <div>asset {params.id}</div>;
}
