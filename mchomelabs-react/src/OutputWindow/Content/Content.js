import styles from './Content.module.css'

const Content = (props) => {
    const content = props.content
    return content.map((line, index) => {
        return <span className={styles.content} key={index}>{line}</span>
    })
}

export default Content