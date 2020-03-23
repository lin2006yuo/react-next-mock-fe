import React, { Component } from "react"
import JSONInput from "react-json-editor-ajrm"
import locale from "react-json-editor-ajrm/locale/en"

class MyEditor extends Component {
  state = {}
  containerRef = React.createRef()

  handleChange = e => {
    const { onChange, onEditorError, field } = this.props
    if (!e.error) {
      onChange && onChange(field, e.json)
    } else {
      onEditorError && onEditorError()
    }
  }

  render() {
    // return <JsonEditor value={""} onChange={this.handleChange} />
    const json = this.props.json ? JSON.parse(this.props.json) : {}
    return (
      <JSONInput
        id="a_unique_id"
        placeholder={json}
        onChange={this.handleChange}
        onKeyPressUpdate={false}
        // colors={darktheme}
        // locale={this.props.json}
        height="550px"
        style={{
          body: {
            fontSize: "16px",
            fontFamily: 'Consolas'
          }
        }}
      />
    )
  }
}

export default MyEditor
