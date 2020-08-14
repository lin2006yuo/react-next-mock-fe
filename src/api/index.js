import Request from "api/fetch"

export async function getProjectList() {
  return Request("/list").get().then(json => json.data)
}

export function createProject({ name, url, desc }) {
  return Request("/list/create").data({ name, url, desc }).post().then(json => json.data)
}