'use strict';
import styles from './styles.module.scss';
import Icon from './icon.svg';
import { useState } from 'react';

const EchoForm = ({handler}) => {
  const [echoInput, setEchoInput] = useState("");
  return (
    <form className={styles.form} id="echo-form" onSubmit={(e) => {handler(e, echoInput, setEchoInput);}}>
      <textarea className={styles.input} required id="echo-input" onChange={(e) => setEchoInput(e.target.value)} placeholder={'There\u2019s a snake here…'} type='text' value={echoInput}/>
      <button className={styles.button}>
        <Icon />
      </button>
    </form>
  );
};

export default EchoForm;