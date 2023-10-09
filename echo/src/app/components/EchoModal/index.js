'use strict';
import styles from './styles.module.scss';

const EchoModal = ({echoes, ...rest}) => {
  return echoes?.length > 0
    ? (
      <article {...rest} className={styles.modal} id="echo-modal" onClick={(e) => e.stopPropagation()}>
        {echoes.map((echo) => <p key={echo.id}>{echo.text}</p>)}
      </article>
    )
    : null;
};

export default EchoModal;