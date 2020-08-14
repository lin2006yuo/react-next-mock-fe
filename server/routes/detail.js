var fs = require("fs")
var express = require("express")
var router = express.Router()
var util = require("../common/utils")
var project = require("../models/projects")
var api = require("../models/apis")

// 查看接口列表
router.get("/detail", (req, res) => {
  var projectId = req.query.id
  project.selectOneProject(projectId).then(selectedProject => {
    api.selectAllApi(projectId).then(list => {
      res.json({
        code: 0,
        msg: "ok",
        data: {
          haveList: true,
          list: list,
          projectUrl: selectedProject.url,
          projectId: selectedProject.id
        }
      })
    })
  })
})

// 查询接口详情
router.get("/detail/edit", (req, res) => {
  var apiId = req.query.id

  if (!apiId) {
    res.redirect("/")
  } else {
    api.selectOneApi(apiId).then(api => {
      project.selectOneProject(api.project_id).then(project => {
        var projectName = project.name
        var projectId = project.id
        res.json({
          code: 0,
          msg: "ok",
          data: {
            projectName: projectName,
            projectId: projectId,
            ...api
          }
        })
      })
    })
  }
})

//存储json
router.post("/detail/save", (req, res) => {
  var name = req.body.name.replace(/\s/g, ""),
    url = req.body.url.replace(/\s/g, ""),
    projectId = req.body.projectId.replace(/\s/g, ""),
    apiId = req.body.apiId,
    desc = req.body.desc,
    content = req.body.content

  if (url && content) {
    if (!apiId) {
      api
        .addApi({
          name: name,
          desc: desc,
          content: content,
          projectId: projectId,
          url: url
        })
        .then(function() {
          res.json({
            code: 0,
            msg: "新增成功"
          })
        })
    } else {
      api
        .updateApi(
          {
            name: name,
            desc: desc,
            content: content,
            url: url
          },
          {
            where: {
              id: apiId
            }
          }
        )
        .then(function() {
          res.json({
            code: 0,
            msg: "修改成功"
          })
        })
    }
  } else {
    res.json({
      success: false,
      message: "名称或url不能为空"
    })
  }
})


//删除接口
router.post("/detail/delete", (req, res) => {
  var id = req.body.id.replace(/\s/g, ""),
    del = api.deleteApi(id)

  del
    .then(response => {
      res.json({
        code: 0,
        msg: "删除成功！"
      })
    })
    .catch(e => {
      res.status(500).json({
        msg: "删除出错！"
      })
    })
})

//创建接口页面
router.get("/create/:projectId", (req, res) => {
  var projectId = req.params.projectId
  project.selectOneProject(projectId).then(project => {
    res.render("create", {
      isEdit: false,
      projectName: project.name,
      projectId: project.id,
      projectUrl: project.url
    })
  })
})

// 查询
router.post("/detail/search", (req, res) => {
  var url = req.body.url
  var projectId = req.body.projectId
  api
    .selectApiByCondiction({
      url: {
        $like: "%" + url + "%"
      },
      state: 1,
      project_id: projectId
    })
    .then(list => {
      res.json(list)
    })
})

//获取一个数据文件
router.all("/api/:apiId", (req, res) => {
  var id = req.params.apiId

  api.selectOneApi(id).then(
    api => {
      res.json(JSON.parse(api.content))
    },
    () => {
      res.status(404)
    }
  )
})

router.get("*", (req, res) => {
  const [url, search] = req.url.split("?")
  console.log(url)
  if (url) {
    api.findOneApiByUrl(url).then(data => {
      if (data) {
        res.json(JSON.parse(data.content))
      }
    })
  }
})

module.exports = router
