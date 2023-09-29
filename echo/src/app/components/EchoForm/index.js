'use strict'
import { useState } from 'react';

export default ({sendEcho}) => {
  const [echoInput, setEchoInput] = useState("");
  return (
    <form id="echo-form" onSubmit={(e) => {sendEcho(e, echoInput, setEchoInput)}}>
      <label htmlFor="echo-input">your echo</label>
      <input required id="echo-input" onChange={(e) => setEchoInput(e.target.value)} placeholder={'There\u2019s a snake here…'} type='text' value={echoInput}/>
    </form>
  );
};