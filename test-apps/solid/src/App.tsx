// import Icon from "@xcomponents/icon";
import { Button } from "./components/Button";
import { TextInput } from "@xcomponents2/text-input";
import { IconButton } from "@xcomponents2/button";

export default function App() {
  // @ts-ignore
  let api: ButtonApi;

  return (
    <>
      {/* <Button
        ref={(ref) => (api = ref)}
        endIcon="chevron-down"
        label="Click me"
        pt:root={{
          height: "70px",
        }}
        onClick={(e) => {
          console.log("Button clicked", e);
          console.log("api is", api);
          api.setLoading(!api.isLoading);
        }}
      />
      <Button
        size="large"
        ref={(ref) => (api = ref)}
        endIcon="chevron-down"
        label="Click me"
        pt:root={{
          height: "10px",
        }}
        onClick={(e) => {
          console.log("Button clicked", e);
          console.log("api is", api);
          api.setLoading(!api.isLoading);
        }}
      /> */}
      <TextInput
        clerable
        ref={(ref) => (api = ref)}
        placeholder="Enter text"
        startIcon="lucide:search"
        endLabel="PX"
        onClick={(e) => {
          console.log("Button clicked", e);
          console.log("api is", api);
        }}
      />
      {/* <IconButton icon="lucide:clock" /> */}
    </>
  );
}
