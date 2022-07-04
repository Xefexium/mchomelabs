import { useEffect, useRef, useState } from 'react'
import { command } from '../services/rcon';
import Content from './Content'
import styles from './OutputWindow.module.css'

const OutputWindow = () => {

  const [inputText, setInputText] = useState('')
  const [outputs, setOutputs] = useState(['Enter a command below!'])
  const contentWindow = useRef(null)

  useEffect(() => {
    scrollToBottom()
    console.log("scrolled")
  }, [outputs])

  const handleOnChange = (e) => {
    setInputText(e.target.value)
  }

  const handleOnKeyUp = async (e) => {
    if (e.key === 'Enter') {
      let output = await command(inputText)
      setOutputs(outputs.concat(output.data))
      
    }
  }

  const scrollToBottom = () => {
    contentWindow.current.scrollIntoView({behavior: "smooth"})
  }

  return (
    <div className={styles.outputWindow}>
      <div className={styles.content} >
        <Content content={outputs}></Content>
        <div ref={contentWindow}></div>
      </div>
      <input className={styles.commandInput} type='text' name='command' placeholder='set time 0' value={inputText} onChange={handleOnChange} onKeyUp={handleOnKeyUp}></input>
    </div>
  );
}

export default OutputWindow