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
// import "../common/style/index.less"
import SearchInput from "../components/search_input"
import DetailItem from "../components/detail_item"
// import Editor from "../components/editor"
import dynamic from "next/dynamic"
import { withRouter } from "next/router"
import Router from "next/router"
// import Editor from '../components/editor'

const Editor = dynamic(import("../components/editor"), {
  ssr: false
})

const initDetail = { name: "", desc: "", url: "", content: "" }
class Detail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      projectId: props.url.query.id,
      apis: props.apiInfo.list,
      showSearch: false,
      detailLoading: false,

      deleteConfirm: false,

      detail: props.detail ? props.detail : initDetail
    }
    this.editorRef = React.createRef()
    this.searchInputRef = React.createRef()
  }

  static async getInitialProps({ query }) {
    const projectId = query.id
    const apiId = query.api_id
    let jsonDetail
    const res = await fetch(`http://localhost:8084/detail?id=${projectId}`)
    if (apiId) {
      const resDetail = await fetch(
        `http://localhost:8084/detail/edit?id=${apiId}`
      )
      jsonDetail = await resDetail.json()
    }
    const json = await res.json()
    return {
      apiInfo: json.data,
      detail: jsonDetail ? jsonDetail.data : initDetail
    }
  }

  handleItemClick = async id => {
    if (this.detailLoading) return
    this.setState(
      {
        detailLoading: true,
        editorError: false
      },
      async () => {
        const {
          query: { id: projectId },
          pathname
        } = this.props.router
        const href = `${pathname}?id=${projectId}&api_id=${id}`
        Router.replace(href, href, {
          shallow: true
        })
        const res = await fetch(`http://localhost:8084/detail/edit?id=${id}`)
        const json = await res.json()
        this.setState({
          detail: json.data,
          detailLoading: false
        })
      }
    )
  }

  handleInputChange = (field, value) => {
    this.setState({
      detail: {
        ...this.state.detail,
        [field]: value
      }
    })
  }

  handleModify = async () => {
    console.log(this.searchInputRef)
    const { value: content, annotations } = this.editorRef.onValidate()
    // if (annotations.length) {
    //   return Alert.warning("JSON格式错误")
    // }
    // const { name, desc, url, id } = this.state.detail
    // const projectId = this.props.router.query.id
    // const res = await fetch("http://localhost:8084/detail/save", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({ name, desc, url, content, projectId, apiId: id })
    // })
    // const json = await res.json()
    // if (!json.code) {
    //   Alert.success(json.msg)
    //   this.reload()
    // }
  }

  handleCreate = () => {
    this.setState({
      detail: initDetail
    })
  }

  handleDeleteApi = async id => {
    const res = await fetch("http://localhost:8084/detail/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    })
    const json = await res.json()
    if (!json.code) {
      this.reload()
    }
  }

  reload() {
    const href = this.props.router.asPath
    window.location.reload()
  }

  render() {
    const { projectUrl } = this.props.apiInfo
    const { apis } = this.state
    const { detail: api, editorError } = this.state
    const apiId = this.props.router.query.api_id

    return (
      // <Hotkeys
      //   keyName="ctrl+p"
      //   onKeyDown={(keyName,e) => {
      //     // e.preventDefault()
      //   }}
      // >
        <div className="flex p-detail">
          <div className="list-wrap flex flex-column">
            <SearchInput onRef={ref => {this.searchInputRef = ref}} list={apis} onSelected={this.handleItemClick} />
            <div className="title">
              <header className="text-center">接口列表</header>
              <div className="text-extra text-center margin-top-10">
                {projectUrl}
              </div>
              <Divider />
            </div>

            <div className="list">
              {apis.map((api, index) => (
                <div id={api.id} key={api.id}>
                  <div
                    className={`flex list-item cursor-point ${
                      api.id === apiId ? "text-primary" : ""
                    }`}
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
                    </Whisper>
                    &nbsp;&nbsp;&nbsp;
                    <div
                      className="text-ellipsis"
                      onClick={this.handleItemClick.bind(this, api.id)}
                      onDoubleClick={() => {
                        this.setState({
                          deleteConfirm: true
                        })
                      }}
                    >
                      {api.url}
                    </div>
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
                json={api.content}
                onRef={ref => {
                  this.editorRef = ref
                }}
                onKeyCtrlP={() => {
                  this.searchInputRef.handleOpen()
                }}
              />
              <div className="flex flex-column">
                <Button
                  appearance="ghost"
                  className="margin-left-10 margin-bottom-10"
                  style={{ width: "80px", height: "46px" }}
                  onClick={this.handleCreate}
                >
                  新增
                </Button>
                <Button
                  appearance="ghost"
                  className="margin-left-10"
                  disabled={!api.url || !api.name}
                  style={{ width: "80px", height: "46px" }}
                  onClick={this.handleModify}
                >
                  提交
                </Button>
              </div>
            </div>
          </div>
        </div>
      // </Hotkeys>
    )
  }
}

export default withRouter(Detail)
