'use strict'
'use client'
import styles from './page.module.css'
import { useState, useEffect } from 'react'

export default () => {
  const [messages, setMessages] = useState([{id: 1, text:"hey"}]);
  const [echoInput, setEchoInput] = useState("");
  const [userPosition, setUserPosition] = useState(null);

  useEffect(() => {
    // TODO: on page load, get messages in my area - depend on: client location.

    // On page load, save user location to state.
    navigator.geolocation?.getCurrentPosition(setUserPosition, console.error);
  }, []);
  const sendNewEcho = (e) => {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition(
      position => {
        setUserPosition(position);
        setMessages([...messages, {id: messages.length + 1, text: echoInput, coords: position.coords}]);
        setEchoInput("");
        console.log(position.coords);
      }, 
      err => {
        console.error(err);
        alert("Must enable location to leave an echo.");
      });
  }
  return (
    <main className={styles.main}>
      <h1>Echo</h1>
      <ol>
        { messages.map(m => <li key={m.id}>{m.text}</li>) }
      </ol>
      <form onSubmit={sendNewEcho}>
        <label htmlFor="echo-input">your echo</label>
        <input required id="echo-input" onChange={e => setEchoInput(e.target.value)} placeholder={'There\u2019s a snake…'} type='text' value={echoInput}/>
      </form>
    </main>
  )
};
