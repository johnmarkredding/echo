import { postEcho } from "./postEcho";
export default (e, {latitude, longitude}) => {
  e.preventDefault();
  postEcho({text: echoInput, coords: {latitude, longitude}})
    .then(console.log)
    .catch((err) => {console.error("Not possible", err)})
    .finally(() => {setEchoInput("")});
}