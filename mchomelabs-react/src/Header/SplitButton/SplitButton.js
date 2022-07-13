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
import { startServer, forceKillServer, getServerRunning } from '../../services/server'
import { command } from '../../services/rcon'

const START_SERVER = 0
const STOP_SERVER = 1
const FORCE_STOP = 2

export default function SplitButton() {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isServerRunning, setIsServerRunning] = useState(false)

  useEffect(() => {
    const interval = setInterval(async () => {
      const isRunning = await getServerRunning()
      setIsServerRunning(isRunning)
    }, 5000);

    return () => clearInterval(interval)
  }, [isServerRunning, selectedIndex])

  const handleClick = async () => {
    if (selectedIndex === START_SERVER) {
      await startServer()
      setSelectedIndex(1)
    }
    else if (selectedIndex === STOP_SERVER) {
      await command('stop')
      setSelectedIndex(0)
    }
    else if (selectedIndex === FORCE_STOP) {
      await forceKillServer()
      setSelectedIndex(0)
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
  const getButtonColor = () => {
    return selectedIndex === 0 ? "primary" : "error"
  }

  const getButtonText = () => {
    if (selectedIndex === START_SERVER)
      return 'Start Server'
    else if (selectedIndex === STOP_SERVER)
      return 'Stop Server'
    else if (selectedIndex === FORCE_STOP)
      return 'Force Stop Server'
  }

  const isButtonDisabled = () => {
    return (selectedIndex === 0 && isServerRunning) || (selectedIndex !== 0 && !isServerRunning)
  }
  const isSelectionDisabled = (index) => {
    return (index === 0 && isServerRunning) || (index !== 0 && !isServerRunning)
  }

  return (
    <Fragment>
      <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
        <Button onClick={handleClick} color={getButtonColor()} disabled={isButtonDisabled()}>{getButtonText()}</Button>
        <Button
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
          color={getButtonColor()}
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
                      disabled={isSelectionDisabled(index)}
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
