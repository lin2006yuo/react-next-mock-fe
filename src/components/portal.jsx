import React, { useRef } from "react"
import ReactDOM from 'react-dom'
const modalRoot = document.getElementById("modal")

const Protal = ({ children }) => {
  const el = useRef(modalRoot)
  return ReactDOM.createPortal(
    children,
    el.current
  )
}

export default Protal
