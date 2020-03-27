import React from "react"
import Head from "next/head"
import Link from "next/link"
import Router, { withRouter } from "next/router"
import {
  Button,
  Modal,
  Divider,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  HelpBlock,
  Alert,
  Icon
} from "rsuite"
import Hotkeys from "react-hot-keys"
import "isomorphic-unfetch"
import "common/style/index.less"
import { getProjectList } from 'api/index'

class Home extends React.Component {
  state = {
    formValue: {
      name: "",
      url: "",
      desc: ""
    },
    show: false,
    miniShow: false, //是否进入项目
    deleteShow: false, //是否删除
    selectId: "", // 删除选中的id
    currentProjuectId: ""
  }

  static async getInitialProps() {
    const data = await getProjectList()
    return { projects: data }
  }

  onOpen = () => {
    this.setState({
      show: true
    })
  }

  onClose = (str, e) => {
    this.setState({
      show: false,
      formValue: { name: "", url: "", desc: "" }
    })
  }

  onMiniClose = () => {
    this.setState({
      miniShow: false,
      show: false
    })
    window.location.reload()
  }

  onKeyUp = (str, e) => {
    e.preventDefault()
    this.setState({ show: true })
  }

  onSubmit = async () => {
    const { name, url, desc } = this.state.formValue
    const data = await createProject({name, url, desc})
    // const json = await res.json()
    if (!json.code) {
      this.setState({
        miniShow: true,
        currentProjuectId: data.id
      })
    } else {
      Alert.error("重复的项目名字")
    }
  }

  onDelete = async id => {
    this.setState({
      selectId: id,
      deleteShow: true
    })
  }

  handleDelete = async () => {
    const id = this.state.selectId
    const res = await fetch("http://localhost:8084/list/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    })
    await res.json()
    window.location.reload()
  }

  onEnterProject = (keyName, e) => {
    e.preventDefault()
    Router.push(`/detail?id=${this.state.currentProjuectId}`)
  }

  handleChange = value => {
    this.setState({
      formValue: value
    })
  }

  render() {
    const { projects } = this.props
    return (
      <div className="layout p-index">
        <Head>
          <title>Home</title>
        </Head>
        <Hotkeys keyName="ctrl+o" onKeyDown={this.onKeyUp}>
          <div className="hero container">
            <h1 className="title">Welcome to Moooooooooooooooooock</h1>
            <Button
              onClick={this.onOpen.bind(this)}
              className="margin-tb-10"
              appearance="ghost"
            >
              创建项目
            </Button>
          </div>
        </Hotkeys>
        <div className="margin-top-10">
          {projects.map((project, index) => (
            <div key={index}>
              <div className="flex justify-between text-desc">
                <Link href={`detail?id=${project.id}`}>
                  <div className="flex flex-flex left cursor-point">
                    <div>{`${index + 1}.  `}&nbsp;</div>
                    <div>
                      <div>
                        {project.name}{" "}
                        <span className="text-extra-deep">
                          （{project.desc}）
                        </span>
                      </div>
                      <div className="text-extra">{project.url}</div>
                    </div>
                  </div>
                </Link>
                <Icon
                  icon="close cursor-point"
                  onClick={() => this.onDelete(project.id)}
                />
              </div>
              <Divider />
            </div>
          ))}
        </div>

        <Modal show={this.state.show} onHide={this.onClose} size="xs">
          <Modal.Header>
            <Modal.Title>创建项目</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form
              fluid
              onChange={this.handleChange}
              formValue={this.state.formValue}
            >
              <FormGroup>
                <ControlLabel>项目名称</ControlLabel>
                <FormControl autoFocus name="name" />
                <HelpBlock>Required</HelpBlock>
              </FormGroup>
              <FormGroup>
                <ControlLabel>项目路径</ControlLabel>
                <Hotkeys keyName="ctrl+a" onKeyDown={this.onClose}>
                  <FormControl name="url" />
                </Hotkeys>
                <HelpBlock>Required</HelpBlock>
              </FormGroup>
              <FormGroup>
                <ControlLabel>描述</ControlLabel>
                <FormControl rows={5} name="desc" componentClass="textarea" />
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.onSubmit} appearance="primary">
              确定
            </Button>
            <Button onClick={this.onClose} appearance="subtle">
              取消
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal size="xs" show={this.state.miniShow} onHide={this.onMiniClose}>
          <Hotkeys keyName="enter" onKeyDown={this.onEnterProject}>
            <Modal.Body>
              <div className="text-center">
                <Icon
                  size="2x"
                  icon="check-circle text-success margin-bottom-10"
                />
              </div>
              <Modal.Title className="text-center">
                创建成功，是否进入项目？
              </Modal.Title>
            </Modal.Body>
          </Hotkeys>
        </Modal>

        <Modal
          size="xs"
          show={this.state.deleteShow}
          onHide={() => {
            this.setState({
              deleteShow: false
            })
          }}
        >
          <Modal.Body>
            <div className="text-center">
              <Icon
                size="2x"
                icon="close-circle text-error margin-bottom-10"
              />
            </div>
            <Modal.Title className="text-center">是否删除该项目？</Modal.Title>
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={this.handleDelete} appearance="primary">
              确定
            </Button>
            <Button
              onClick={() => {
                this.setState({
                  deleteShow: false
                })
              }}
              appearance="subtle"
            >
              取消
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default withRouter(Home)
