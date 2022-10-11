import { useEffect, useRef, useState } from 'react'
import { TextField } from '@mui/material'
import { command } from '../services/RCONService'
import styles from './OutputWindow.module.css'
import React from 'react'

const OutputWindow = () => {

  const [inputText, setInputText] = useState('')
  const [outputs, setOutputs] = useState(Array<string>)
  const contentWindow = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [outputs])

  const handleOnChange = (e: any) => {
    setInputText(e.target.value)
  }

  const handleOnKeyUp = async (e: any) => {
    if (e.key === 'Enter') {
      let output = await command(inputText)
      setOutputs([...outputs, output])
    }
  }

  const scrollToBottom = () => {
    contentWindow!.current!.scrollIntoView({ behavior: "smooth" })
  }

  const ensureValueHasLinebreak = (value: string) => {
    return value.endsWith('\n') ? value : value + '\n'
  }

  return (
    <div className={styles.outputWindow}>
      <div className={styles.content} >
        {outputs.map((value, index) => {
          return <span key={index}>{ensureValueHasLinebreak(value)}</span>
        })}
        <div ref={contentWindow}></div>
      </div>
      <TextField className={styles.commandInput} type='text' variant='outlined' placeholder='set time 0' value={inputText} onChange={handleOnChange} onKeyUp={handleOnKeyUp}></TextField>
    </div>
  );
}

export default OutputWindow