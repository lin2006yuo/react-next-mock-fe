import React, { Component } from "react"
import { Input } from "rsuite"

class DetailItem extends Component {
  handleChange(value) {
    const {field, onChange } = this.props
    onChange && onChange(field, value)
  }
  render() {
    const { name, text, className, field, placeholder } = this.props
    return (
      <div className={`c-detail-item ${className}`}>
        <div className="name">{name}：</div>
        <div className="text"><Input placeholder={placeholder} onChange={this.handleChange.bind(this)} value={text} /></div>
      </div>
    )
  }
}

export default DetailItem
