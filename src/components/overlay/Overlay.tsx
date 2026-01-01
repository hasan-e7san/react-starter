import React from "react"

export type OverlayProps = {
  show: boolean
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  zIndex: 9999,
}

export function Overlay({ show }: OverlayProps) {
  return show ? <div style={overlayStyle} /> : null
}
