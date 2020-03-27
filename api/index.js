import Request from "api/fetch"

export async function getProjectList() {
  const json = await Request("/list").get()
  return json.data
}

export async function createProject({name, url, desc}) {
  const json = await Request("/list/create")
    .data({ name, url, desc })
    .post()
  return json.data
}
