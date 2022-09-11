import { useEffect, useRef, useState } from 'react'
import { TextField } from '@mui/material'
import { command } from '../services/RCON';
import styles from './OutputWindow.module.css'

const OutputWindow = () => {

  const [inputText, setInputText] = useState('')
  const [outputs, setOutputs] = useState([])
  const contentWindow = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [outputs])

  const handleOnChange = (e) => {
    setInputText(e.target.value)
  }

  const handleOnKeyUp = async (e) => {
    if (e.key === 'Enter') {
      let output = await command(inputText)
      setOutputs([...outputs, output])
    }
  }

  const scrollToBottom = () => {
    contentWindow.current.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className={styles.outputWindow}>
      <div className={styles.content} >
        {outputs.map((value, index) => {
          return <span key={index}>{value}</span>
        })}
        <div ref={contentWindow}></div>
      </div>
      <TextField className={styles.commandInput} type='text' variant='outlined' placeholder='set time 0' value={inputText} onChange={handleOnChange} onKeyUp={handleOnKeyUp}></TextField>
    </div>
  );
}

export default OutputWindow