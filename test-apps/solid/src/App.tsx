// import Icon from "@xcomponents/icon";
import Modal, { type Api } from "@xcomponents/modal";

export default function App() {
  let moadlApi: Api;

  return (
    <div
      style={{
        position: "fixed",
        width: "100%",
        height: "100%",
        display: "grid",
        "place-items": "center",
      }}
    >
      <div style="display: flex; flex-gap: 10px">
        Modal test
        <button
          onClick={() => {
            moadlApi.open();
          }}
        >
          Open Modal
        </button>
        <Modal ref={(api) => (moadlApi = api)}>
          <h1>Inside the modal</h1>
        </Modal>
      </div>
    </div>
  );
}
