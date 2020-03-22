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
import classnames from "classnames"
const { Bounce } = Animation

class SearchInput extends React.Component {
  searchInputRef = React.createRef()
  state = {
    showSearch: false,
    filterList: [],
    query: "",
    listItemIndex: 0
  }

  handleOpen = (keyName, e) => {
    e.preventDefault()
    this.setState(
      {
        showSearch: !this.state.showSearch
      },
      () => {
        this.searchInputRef.current.focus()
      }
    )
  }

  handleFilter = e => {
    const query = e.target.value
    const apis = this.props.list
    const filterList = apis.filter(api => api.url.search(query) !== -1)
    this.setState({
      filterList,
      listItemIndex: 0
    })
  }

  handleSearchKeyUp = e => {
    e.preventDefault()
    const { listItemIndex } = this.state
    /**
     * keyCode
     *  esc === 27
     *  up === 38
     *  down === 40
     */
    const { keyCode } = e
    switch (keyCode) {
      case 27:
        this.handleExit()
        break
      case 38:
        if (listItemIndex <= 0) return
        this.setState({
          listItemIndex: listItemIndex - 1
        })
        break
      case 40:
        const { length } = this.state.filterList
        if (listItemIndex >= length - 1) return
        this.setState({
          listItemIndex: listItemIndex + 1
        })
        break
      default:
        break
    }
  }

  handleSelectListItem = e => {
    console.log(e.keyCode)
  }

  handleExit = () => {
    this.setState({
      showSearch: false,
      filterList: [],
      query: "",
      listItemIndex: 0
    })
  }

  render() {
    const { showSearch, filterList, listItemIndex } = this.state
    return !!showSearch ? (
      <div className="search">
        <input
          ref={this.searchInputRef}
          autoFocus
          size="lg"
          className="search-input"
          placeholder="接口搜索"
          onBlur={this.handleExit}
          onChange={this.handleFilter}
          onKeyUp={this.handleSearchKeyUp}
        />
        {!!filterList.length && (
          <div className="overflow-y filter-wrap width-100">
            <div className="filter-list">
              {filterList.map((api, index) => (
                <div
                  key={api.id}
                  className={classnames("filter-item", {
                    active: index === listItemIndex
                  })}
                >
                  {api.url}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    ) : (
      <Hotkeys keyName="ctrl+p" onKeyDown={this.handleOpen}>
        <div />
      </Hotkeys>
    )
  }
}

export default SearchInput
