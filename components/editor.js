import React, { Component } from "react"
import JSONInput from "react-json-editor-ajrm"
import locale from "react-json-editor-ajrm/locale/en"

class MyEditor extends Component {
  state = {}
  containerRef = React.createRef()

  render() {
    // return <JsonEditor value={""} onChange={this.handleChange} />
    const json = this.props.json ? JSON.parse(this.props.json) : {}
    return (
      <JSONInput
        id="a_unique_id"
        placeholder={json}
        // colors={darktheme}
        // locale={this.props.json}
        height="550px"
      />
    )
  }
}

export default MyEditor
