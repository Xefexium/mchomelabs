import { useState, useRef, Fragment, useEffect } from 'react'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import ArrowDropDown from '@mui/icons-material/ArrowDropDown'
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import { startServer, forceKillServer } from '../../services/server'
import { command } from '../../services/rcon'
import io from 'socket.io-client'

const START_SERVER = 'Start Server'
const STOP_SERVER = 'Stop Server'
const FORCE_STOP = 'Force Stop'
const options = [START_SERVER, STOP_SERVER, FORCE_STOP]

const socket = io()

export default function SplitButton() {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isServerRunning, setIsServerRunning] = useState(false)

  useEffect(() => {
    socket.connect()
    socket.on('Server Down', () => {
      setSelectedIndex(0)
      setIsServerRunning(true)
    })
    socket.on('Server Up', () => {
      setSelectedIndex(1)
      setIsServerRunning(false)
    })

    return () => {
      socket.off('Server Down')
      socket.off('Server Up')
      socket.disconnect()
    }
  }, [])

  const handleClick = async () => {
    if (options[selectedIndex] === START_SERVER) {
      await startServer()
    }
    else if (options[selectedIndex] === STOP_SERVER) {
      await command('stop')
    }
    else if (options[selectedIndex] === FORCE_STOP) {
      await forceKillServer()
    }
  }

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index)
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setOpen(false)
  }

  return (
    <Fragment>
      <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
        <Button onClick={handleClick} color={selectedIndex === 0 ? "primary" : "error"}>{options[selectedIndex]}</Button>
        <Button
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
          color={selectedIndex === 0 ? "primary" : "error"}
        >
          <ArrowDropDown />
        </Button>
      </ButtonGroup>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      disabled={(isServerRunning && index === 0) || (!isServerRunning && (index === 1 || index === 2))}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Fragment>
  )
}
