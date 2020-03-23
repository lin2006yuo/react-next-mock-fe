import React from "react"
import Head from "next/head"
import {
  Button,
  Modal,
  Divider,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  HelpBlock,
  Input,
  Alert,
  Icon,
  Popover,
  Whisper,
  Animation
} from "rsuite"
import Hotkeys from "react-hot-keys"
import "isomorphic-unfetch"
import "../common/style/index.less"
const { Bounce } = Animation
import SearchInput from "../components/search_inpuit"
import DetailItem from "../components/detail_item"
// import Editor from "../components/editor"
import dynamic from "next/dynamic"

const Editor = dynamic(import("../components/editor"), {
  ssr: false
})

class Detail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      projectId: props.url.query.id,
      apis: props.apiInfo.list,
      showSearch: false,
      detailLoading: false,
      editorError: false,

      detail: { name: "", desc: "", url: "", content: "" }
    }
  }

  static async getInitialProps({ query }) {
    const projectId = query.id
    const res = await fetch(`http://localhost:8084/detail?id=${projectId}`)
    const json = await res.json()
    return { apiInfo: json.data }
  }

  handleItemClick = async id => {
    if (this.detailLoading) return
    this.setState(
      {
        detailLoading: true,
        editorError: false
      },
      async () => {
        const res = await fetch(`http://localhost:8084/detail/edit?id=${id}`)
        const json = await res.json()
        this.setState({
          detail: json.data,
          detailLoading: false
        })
      }
    )
  }

  handleApiEdit() {
    console.log("submit")
  }

  handleInputChange = (field, value) => {
    if (field === "content" && this.state.editorError) {
      console.log(1232)
      this.setState({
        editorError: false,
        detail: {
          ...this.state.detail,
          [field]: value
        }
      })
    } else {
      this.setState({
        detail: {
          ...this.state.detail,
          [field]: value
        }
      })
    }
  }

  handleEditError = () => {
    this.setState({
      editorError: true
    })
  }

  handleModify = async () => {
    if (this.state.editorError) {
      return Alert.warning("JSON格式错误")
    }
    const { name, desc, url, content, id, projectId } = this.state.detail
    const res = await fetch("http://localhost:8084/detail/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, desc, url, content, projectId, apiId: id })
    })
    const json = await res.json()
    if (!json.code) {
      return Alert.success("修改成功")
    }
  }

  render() {
    const { projectUrl } = this.props.apiInfo
    const { apis } = this.state
    const { detail: api, editorError } = this.state

    return (
      <div className="flex p-detail">
        <div className="list-wrap flex flex-column">
          <SearchInput list={apis} />

          <div className="title">
            <header className="text-center">接口列表</header>
            <div className="text-extra text-center margin-top-10">
              {projectUrl}
            </div>
            <Divider />
          </div>

          <div className="list">
            {apis.map((api, index) => (
              <div key={api.id}>
                <div
                  className="list-item cursor-point text-ellipsis"
                  onClick={this.handleItemClick.bind(this, api.id)}
                >
                  <Whisper
                    placement="right"
                    trigger="active"
                    speaker={
                      <Popover>
                        <p>{api.url}</p>
                      </Popover>
                    }
                  >
                    <span>{index + 1}.</span>
                  </Whisper>{" "}
                  {api.url}
                </div>

                <Divider />
              </div>
            ))}
          </div>
        </div>
        <Divider className="height-100" vertical />
        <div className="detail-wrap">
          <DetailItem
            className="margin-bottom-10"
            name="名称"
            field="name"
            onChange={this.handleInputChange}
            text={api.name}
          />
          <DetailItem
            className="margin-bottom-10"
            name="描述"
            field="desc"
            onChange={this.handleInputChange}
            text={api.desc}
          />
          <DetailItem
            field="url"
            className="margin-bottom-10"
            name="url"
            onChange={this.handleInputChange}
            text={api.url}
          />

          <div className="flex">
            <Editor
              field="content"
              onChange={this.handleInputChange}
              onEditorError={this.handleEditError}
              json={api.content}
            />
            <Button
              onClick={this.handleApiEdit.bind(this)}
              appearance="ghost"
              className="margin-left-10"
              disabled={!api.url || !api.name || !api.content}
              style={{ width: "80px", height: "46px" }}
              onClick={this.handleModify}
            >
              修改
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export default Detail
