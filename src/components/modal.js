import React, { Component } from 'react'
import { Modal, Button, Icon } from 'rsuite'

class MyModal extends Component {
  static show({ children }) {
    // const nextDom = document.querySelector('#__next')

    // let modalel = document.getElementById('__modal')
    // if (!modalel) {
    //   modalel = document.createElement('div')
    //   modalel.id = '__modal'
    //   nextDom.appendChild(modalel)
    // }

    // ReactDOM.render(<MyModal/>, modalel)

    const divElement = document.createElement('div')
    document.body.appendChild(divElement) 

    ReactDOM.render(<div>123123</div>, divElement)
  }

  static hide() {
    this.setState({
      show: false
    })
  }

  state = {
    show: true
  }

  onConfirm = () => {
    this.props.onConfirm && this.props.onConfirm()
    this.setState({ show: false })
  }

  render() {
    const { name, text, className, field } = this.props
    return (
      <Modal
        size='xs'
        show={this.state.show}
        onHide={() => {
          this.setState({
            show: false
          })
        }}
      >
        <Modal.Body>
          <div className='text-center'>
            <Icon size='2x' icon='close-circle text-error margin-bottom-10' />
          </div>
          <Modal.Title className='text-center'>是否删除该项目？</Modal.Title>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={this.onConfirm} appearance='primary'>
            确定
          </Button>
          <Button
            onClick={() => {
              this.setState({
                show: false
              })
            }}
            appearance='subtle'
          >
            取消
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export default MyModal
