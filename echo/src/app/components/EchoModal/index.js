'use strict';
import styles from './styles.module.scss';

const EchoModal = ({echoes, ...rest}) => {
  return echoes?.length > 0
    ? (
      <article {...rest} className={styles.modal} id="echo-modal" onClick={(e) => e.stopPropagation()}>
        {echoes.map((echo) => <EchoBlock {...echo} key={echo.id}/>)}
      </article>
    )
    : null;
};

const EchoBlock = ({text, coords: {longitude, latitude}, timestamp}) => {
  const minAgo = Math.trunc((Date.now() - Date.parse(timestamp))/60000);
  return (
    <div>
      <p>{text}</p>
      <span>{latitude.toFixed(6) + ', ' + longitude.toFixed(6)}</span>
      <span>
        {
          minAgo
            ? minAgo + 'min ago'
            : 'now'
        }
      </span>
    </div>
  );
};

export default EchoModal;