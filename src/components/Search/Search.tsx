import { useNavigate } from "@solidjs/router";
import FormContextProvider from "../forms/FormContextProvider/FormContextProvider";
import InputText from "../forms/InputText/InputText";
import "./Search.scss";

interface SearchData {
  search: string;
}

export default function Search() {
  const navigate = useNavigate();
  function onSubmit(data: SearchData) {
    navigate("/search?q=" + encodeURIComponent(data.search));
  }
  return (
    <div class="search-component">
      <FormContextProvider initialData={{ search: "" }} onSubmit={onSubmit}>
        <InputText label="Search" name="search" type="search" />
      </FormContextProvider>
    </div>
  );
}
