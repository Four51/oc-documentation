import React, { useRef, useState } from 'react'
import {
  InputBase,
  Theme,
  InputAdornment,
  IconButton,
  Grow,
} from '@material-ui/core'
import { fade, makeStyles, createStyles } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
import { connectSearchBox } from 'react-instantsearch-dom'
import { Close } from '@material-ui/icons'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: (props: any) => ({
      zIndex: 1,
      borderRadius: theme.shape.borderRadius,
      position: 'absolute',
      right: theme.spacing(4),
      top: theme.spacing(3),
      padding: theme.spacing(0, 1.5),
      backgroundColor: props.darkMode
        ? theme.palette.primary.main
        : theme.palette.grey[200],
    }),
    input: (props: any) => ({
      padding: theme.spacing(2, 1, 2, 0),
      width: props.expanded ? 300 : 200,
      transition: theme.transitions.create('width', {
        duration: theme.transitions.duration.shorter,
      }),
      color: props.darkMode ? theme.palette.common.white : undefined,
      '&::placeholder': {
        color: props.darkMode ? theme.palette.common.white : undefined,
      },
    }),
    adornment: (props: any) => ({
      color: props.darkMode ? theme.palette.grey[600] : theme.palette.grey[500],
    }),
  })
)

const OrderCloudSearchBox = ({
  currentRefinement,
  isSearchStalled,
  refine,
  onClick,
  onChange,
  onClose,
  darkMode,
  expanded,
}) => {
  const classes = useStyles({ darkMode, expanded })
  const inputRef = useRef<HTMLInputElement | undefined>()

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    refine(event.currentTarget.value)
    onChange(event)
  }

  const handleInputClick = (event: React.MouseEvent) => {
    onClick(event)
    if (inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleClearClick = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    refine('')
    onClose(event)
  }

  return (
    <InputBase
      value={currentRefinement}
      onChange={handleInputChange}
      onClick={handleInputClick}
      classes={{ input: classes.input, root: classes.root }}
      placeholder="Search OrderCloud…"
      inputProps={{ 'aria-label': 'search' }}
      inputRef={inputRef}
      startAdornment={
        <InputAdornment position="start" classes={{ root: classes.adornment }}>
          <IconButton color="inherit" size="small" edge="start">
            <SearchIcon color="inherit" />
          </IconButton>
        </InputAdornment>
      }
      endAdornment={
        <InputAdornment position="end" classes={{ root: classes.adornment }}>
          <Grow in={Boolean(currentRefinement.length)}>
            <IconButton
              color="inherit"
              size="small"
              edge="end"
              onClick={handleClearClick}
            >
              <Close color="inherit" />
            </IconButton>
          </Grow>
        </InputAdornment>
      }
    />
  )
}
export default connectSearchBox(OrderCloudSearchBox)
