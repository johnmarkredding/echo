import postEcho from './postEcho';
export default (e, text, {latitude, longitude}, setText) => {
  e.preventDefault();
  postEcho({text, coords: {latitude, longitude} })
    .catch((err) => {console.error('Not possible', err)})
    .finally(() => {setText('')});
};