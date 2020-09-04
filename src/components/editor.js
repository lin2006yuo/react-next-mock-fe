import React, { Component } from "react"
import ace from "brace"
// import JSONEditor from "jsoneditor"
import { Icon } from "rsuite"
import "common/style/index.less"
import "brace/theme/monokai"
import "brace/mode/json"
import "brace/ext/beautify" // get reference to extension

class MyEditor extends Component {
  state = {}
  containerRef = React.createRef()
  editor = null

  componentDidMount() {
    // 暴露this
    this.props.onRef && this.props.onRef(this)

    this.editor = ace.edit(this.containerRef.current)
    this.editor.setOptions({
      tabSize: 2,
      onLoad: function (_editor) {
        // This is to remove following warning message on console:
        // Automatically scrolling cursor into view after selection change this will be disabled in the next version
        // set editor.$blockScrolling = Infinity to disable this message
        _editor.$blockScrolling = 1
      }
    })
    this.editor.setTheme("ace/theme/monokai")
    this.editor.getSession().setMode("ace/mode/json")
    this.editor.getSession().setUseWrapMode(true)
    this.editor.setValue(this.props.json, -1)
    this.editor.setFontSize(16)
    this.editor.commands.addCommand({
      name: "test",
      bindKey: { win: "ctrl+p" },
      exec: () => {
        this.props.onKeyCtrlP()
      }
    })
    this.editor.$blockScrolling = "Infinity"
  }

  componentDidUpdate(prevProps) {
    if (this.props.json !== prevProps.json) {
      this.editor.setValue(this.props.json, -1)
      this.editor.scrollToLine(0)
    }
  }

  handleBeautify = () => {
    const code = JSON.parse(this.editor.getValue())
    this.editor.setValue(JSON.stringify(code, null, '\t'));
  }

  onValidate() {
    const annotations = this.editor.getSession().getAnnotations()
    const value = this.editor.getSession().getValue()
    return { value, annotations }
  }

  render() {
    return (
      <div className='c-editor' style={{ height: "600px", flex: 1 }}>
        <div
          ref={this.containerRef}
          id='jsoneditor flex-flex'
          className='json-editor'
          style={{ height: "600px", flex: 1 }}
        />
        <div className='json-tool'>
          <Icon icon='code' size="1x" onClick={this.handleBeautify}/>
        </div>
      </div>
    )
  }
}

export default MyEditor
