import { useParams } from "@solidjs/router";
import { createEffect } from "solid-js";
import { getData } from "../../../components/ApiUtils/ApiUtils";

export default function Asset() {
  const params = useParams();
  createEffect(() => {
    getData("/api/asset/" + params.id).then((response) => {
      console.log(response);
    });
  });

  return <div>asset {params.id}</div>;
}
