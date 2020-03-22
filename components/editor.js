import React, { Component } from "react"
// import { JsonEditor as Editor } from 'jsoneditor-react';
import JSONEditor from 'jsoneditor'
import "jsoneditor/dist/jsoneditor.min.css"

// const JSONEditor = dynamic(import("jsoneditor"), {
//   ssr: false
// })

class MyEditor extends Component {
  state = {}
  containerRef = React.createRef()



  initJsonEditor = () => {
    const options = {
      mode: 'code',
      history: true
    };

    this.jsoneditor = new JSONEditor(this.containerRef.current, options)
    // this.jsoneditor.set(this.props.value)
  }

  componentDidMount() {
    // console.log(this.containerRef)
    this.initJsonEditor()
  }

  render() {
    console.log(this.ref)
    // return <JsonEditor value={""} onChange={this.handleChange} />
    return (
      <div
        className="jsoneditor-react-container"
        ref={this.containerRef}
      />
    )
  }
}

export default MyEditor
