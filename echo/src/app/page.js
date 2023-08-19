'use strict'
'use client'
import styles from './page.module.css';
import { useState, useEffect } from 'react';
import { distinctUntilChanged, map } from 'rxjs';
import { createGeolocationObservable, createPermissionsObservable } from '../utilities/geolocationObservable';


export default () => {
  const [messages, setMessages] = useState([{id: 1, text:"hey"}]);
  const [echoInput, setEchoInput] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [locationAllowed, setLocationAllowed] = useState(false);

  // TODO: on page load, get messages in my area - depend on: client location.
  // TODO: Create new observable for permissions changes. Look into promise->observable;
  

  const sendNewEcho = (e) => {
    e.preventDefault();
    try {
      setMessages([...messages, {id: messages.length + 1, text: echoInput, coords: userLocation}]);
      setEchoInput("");
    } catch {
      console.error("Not possible");
    }
  }
  return (
    <main className={styles.main}>
      <h1>Echo</h1>
      {
        locationAllowed
        ? <>
          <h3>{userLocation?.latitude + ", " + userLocation?.longitude}</h3>
          <ol>
            { messages.map(m => <li key={m.id}>{m.text} {m.coords?.latitude + ", " + m.coords?.longitude}</li>) }
          </ol>
          <form onSubmit={sendNewEcho}>
            <label htmlFor="echo-input">your echo</label>
            <input required id="echo-input" onChange={e => setEchoInput(e.target.value)} placeholder={'There\u2019s a snake…'} type='text' value={echoInput}/>
          </form>
        </>
        : <h2>Location isn't accessible right now</h2>
      }
    </main>
  )
};
