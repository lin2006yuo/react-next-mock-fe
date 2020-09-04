import React from "react"
import Head from "next/head"
import { Button, Divider, Popover, Whisper, Alert, Icon } from "rsuite"
import Hotkeys from "react-hot-keys"
import "isomorphic-unfetch"
import DetailItem from "components/detail_item"
import dynamic from "next/dynamic"
import { withRouter } from "next/router"
import Router from "next/router"
import Request from "api/fetch"
import classNames from "classnames"
import SearchInput from "components/search_input"

const Editor = dynamic(import("components/editor"), {
  ssr: false,
})
// const SearchInput = dynamic(import("components/search_input"), {
//   ssr: false,
// })

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

      detail: props.detail ? props.detail : initDetail,

      isSearchOpen: false,
    }
    this.editorRef = React.createRef()
    this.searchInputRef = React.createRef(null)
  }

  static async getInitialProps({ query }) {
    const projectId = query.id
    const apiId = query.api_id
    let jsonDetail
    return Request("/detail")
      .data({
        id: projectId,
      })
      .get()
      .then((json) => {
        if (apiId) {
          return Request("/detail/edit")
            .data({
              id: apiId,
            })
            .get()
            .then((json2) => {
              return {
                apiInfo: json.data,
                detail: json2.data,
              }
            })
        }
        return {
          apiInfo: json.data,
          detail: initDetail,
        }
      })
  }

  handleItemClick = async (id) => {
    if (this.detailLoading) return
    this.handleSearchOpen(false)
    this.setState(
      {
        detailLoading: true,
        editorError: false,
      },
      async () => {
        const {
          query: { id: projectId },
          pathname,
        } = this.props.router
        const href = `${pathname}?id=${projectId}&api_id=${id}`
        Router.replace(href, href, {
          shallow: true,
        })
        Request("/detail/edit")
          .data({
            id,
          })
          .get()
          .then((json) => {
            this.setState({
              detail: json.data,
              detailLoading: false,
            })
          })
      }
    )
  }

  handleInputChange = (field, value) => {
    this.setState({
      detail: {
        ...this.state.detail,
        [field]: value,
      },
    })
  }

  handleModify = async () => {
    const { value: content, annotations } = this.editorRef.onValidate()
    if (annotations.length) {
      return Alert.warning("JSON格式错误")
    }
    const { name, desc, url, id } = this.state.detail
    const projectId = this.props.router.query.id
    Request("/detail/save")
      .data({
        name,
        desc,
        url,
        content,
        projectId,
        apiId: id,
      })
      .post()
      .then((res) => {
        this.reload()
      })
  }

  handleTest = (url) => {
    window.open(`/api${url}`)
  }

  handleCreate = () => {
    this.editorRef.editor.setValue(`{
  "code": 0,
  "data": [],
  "msg": "ok"
}`)
    this.setState({
      detail: initDetail,
    })
  }

  handleDeleteApi = async (id) => {
    Request("/detail/delete")
      .data({
        id,
      })
      .post()
      .then(() => {
        this.reload()
      })
  }

  handleSearchOpen = (bool) => {
    this.setState({
      isSearchOpen: bool,
    })
  }

  reload() {
    const href = this.props.router.asPath
    window.location.reload()
  }

  render() {
    const { projectUrl } = this.props.apiInfo
    const { apis } = this.state
    const { detail: api, editorError, isSearchOpen } = this.state
    const apiId = this.props.router.query.api_id

    return (
      <Hotkeys keyName="esc" onKeyDown={() => this.handleSearchOpen(false)}>
        <div
          className={classNames("flex p-detail", {
            "bg-blur": isSearchOpen,
          })}
        >
          <div className="list-wrap flex flex-column">
            <SearchInput
              ref={(ref) => {
                this.searchInputRef = ref
              }}
              list={apis}
              onSelected={this.handleItemClick}
              onOpen={this.handleSearchOpen}
            />
            <div className="title">
              <div className="flex align-center justify-center">
                <header className="text-center">接口列表</header>
                <Icon
                  icon="search"
                  className="margin-left-10 cursor-point search-icon"
                  onClick={() => {
                    this.searchInputRef.handleOpen()
                  }}
                />
              </div>
              <div className="text-extra text-center margin-top-10">
                {projectUrl}
              </div>
            </div>

            <div className="list">
              <Button
                block
                appearance="ghost"
                className="margin-tb-10"
                onClick={this.handleCreate}
              >
                新增
              </Button>

              {apis.map((api, index) => (
                <div id={api.id} key={api.id}>
                  <div
                    onClick={this.handleItemClick.bind(this, api.id)}
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
                      onDoubleClick={() => {
                        this.setState({
                          deleteConfirm: true,
                        })
                      }}
                    >
                      <div>{api.url}</div>
                      <div>{api.name}</div>
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
              placeholder="/hello"
              className="margin-bottom-10"
              name="url"
              onChange={this.handleInputChange}
              text={api.url}
            />

            <div className="flex">
              <Editor
                field="content"
                json={api.content}
                onRef={(ref) => {
                  this.editorRef = ref
                }}
                onKeyCtrlP={() => {
                  this.searchInputRef.handleOpen()
                }}
              />
              <div className="flex flex-column">
                <Button
                  appearance="ghost"
                  className="margin-left-10"
                  disabled={!api.url || !api.name}
                  style={{ width: "80px", height: "46px" }}
                  onClick={this.handleModify}
                >
                  提交/更新
                </Button>
                <Button
                  appearance="link"
                  className="margin-left-10"
                  disabled={!api.url || !api.name}
                  style={{ width: "80px", height: "46px" }}
                  onClick={() => this.handleTest(api.url)}
                >
                  测试
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div id="modal"></div>
      </Hotkeys>
      // </Hotkeys>
    )
  }
}

export default withRouter(Detail)
