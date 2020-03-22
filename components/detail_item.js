import React, { Component } from "react"

class DetailItem extends Component {
  render() {
    const { name, text, className } = this.props
    return (
      <div className={`c-detail-item ${className}`}>
        <div className="name">{name}：</div>
        <div className="text">{text}</div>
      </div>
    )
  }
}

export default DetailItem
