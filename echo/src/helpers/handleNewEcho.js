import postEcho from "./postEcho";
export default (e, text, {latitude, longitude}, setText) => {
  e.preventDefault();
  postEcho({text, coords: {latitude, longitude}})
    .then((echo) => {console.log(echo.data)})
    .catch((err) => {console.error("Not possible", err)})
    .finally(() => {setText("")});
}