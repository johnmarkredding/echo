'use strict'
'use client'
import styles from './page.module.css'
import { useState, useEffect } from 'react'

export default () => {
  useEffect(() => {
    // get messages in my area - dep: my location;
  },[]);
  const [messages, setMessages] = useState([{id: 1, text:"hey"}]);
  const [echoInput, setEchoInput] = useState("");
  const sendNewEcho = (e) => {
    e.preventDefault();
    const newMessages = [{id: messages.length + 1, text: echoInput}, ...messages];
    setEchoInput("");
    setMessages(newMessages);
  };
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
}
