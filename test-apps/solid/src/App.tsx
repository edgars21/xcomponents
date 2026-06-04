// import Icon from "@xcomponents/icon";
import {Button} from "@xcomponents/button";

export default function App() {

  return (
    <Button label="Click me" onClick={e => console.log("works: ", e)} />
  );
}
