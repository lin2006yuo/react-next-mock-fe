import { domain } from "api/config"
import { statusCode } from "api/code"
import { Alert } from "rsuite"

function handleGetHref(location, object) {
  const entries = Object.entries(object)
  const len = entries.length
  if (!len) return location
  entries.reduce((t, c, i) => {
    if (i === len - 1) {
      return (t += c.join("="))
    } else {
      return (t += c.join("=") + "&")
    }
  }, location + "?")
}

class Fetch {
  constructor() {
    this.domain = domain
    this.url = ""
    this._data = {}
  }
  setDomain(domain) {
    this.domain = domain
  }
  setUrl(url) {
    this.url = url
  }
  data(data) {
    this._data = data
    return this
  }
  async get() {
    const href = handleGetHref(this.domain + this.url, this._data)
    const res = await fetch(href)
    return this.responseInterceptor(res)
  }
  async post() {
    const res = await fetch(this.domain + this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this._data)
    })
    return this.responseInterceptor(res)
  }

  responseInterceptor(res) {
    // todo 根据状态显示弹窗类型
    if (statusCode[res.status]) {
      Alert.error(statusCode[res.status].msg)
      return Promise.reject()
    }
    return res.json().then(json => json)
  }
}

const fetchInstance = new Fetch()

const request = url => {
  fetchInstance.setUrl(url)
  return fetchInstance
}

export default request
