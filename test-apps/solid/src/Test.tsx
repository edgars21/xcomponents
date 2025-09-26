export default function Test(props: { text: string }) {
  return <div style={{ outline: "2px solid red" }}>test is: {props.text}</div>;
}
