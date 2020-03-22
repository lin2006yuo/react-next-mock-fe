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

      detail: {
        api: {},
        projectName: "quxue-management-frontend",
        projectId: "7355dd29-1b81-4470-80b2-8f0619c5c69f"
      }
    }
  }

  static async getInitialProps({ query }) {
    const projectId = query.id
    const res = await fetch(`http://localhost:8084/detail?id=${projectId}`)
    const json = await res.json()
    return { apiInfo: json.data }
  }

  handleItemClick = async id => {
    const res = await fetch(`http://localhost:8084/detail/edit?id=${id}`)
    const json = await res.json()
    this.setState({
      detail: json.data
    })
  }

  render() {
    const { projectUrl } = this.props.apiInfo
    const { apis } = this.state
    const { api, projectName, projectId } = this.state.detail

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
            text={api.name}
          />
          <DetailItem
            className="margin-bottom-10"
            name="描述"
            text={api.desc}
          />
          <DetailItem className="margin-bottom-10" name="url" text={api.url} />
          <Editor key={api.id} json={api.content}/>
        </div>
      </div>
    )
  }
}

export default Detail
