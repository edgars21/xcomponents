import { Select } from "@xcomponents2/select";

export default function App() {
  // @ts-ignore
  let api: ButtonApi;

  return (
    <>
      <Select
        clearable
        options={[
          { value: "1", label: "Option 1" },
          { value: "2", label: "Option 2" },
        ]}
      />
    </>
  );
}
