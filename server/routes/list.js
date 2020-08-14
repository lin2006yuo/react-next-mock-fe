var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();
var util = require('../common/utils');

var project = require('../models/projects')
var api = require('../models/apis')

// 获取所有项目
router.get('/list', (req, res, next) => {
	project.selectAllProject().then(list => {
		res.status(200).json({
			data: list.length > 0 ? list : []
		})
	})
	.catch((response) => {
		res.json(response)
	})
})

// 创建项目
router.post('/list/create', (req, res) => {

	const name = req.body.name;
	const url = req.body.url;
	const desc = req.body.desc;

	project.addProject({name, url, desc}).then(function (data) {
		res.status(200).json({msg: '创建成功！', code: 0, data}).end()
	}).catch(err => {
		res.status(201).json({msg: '重复的项目名字', code: 1, data: err})
	})
})

router.post('/list/delete', (req, res) => {
	var id = req.body.id;

	api.deleteProjectApis(id)
	project.deleteProject(id)

	res.json({
		code: 2000,
		msg: '删除成功！'	
	})
})

router.get('/list/download/:projectName', (req, res) => {
	var projectName = req.params.projectName;
	var pathName = path.resolve(__dirname, '../json/');

	var options = {
		root: pathName,
	}

	res.sendFile(projectName, options, function(err){
		console.log(err)
	})

	// res.download(pathName, projectName);
	// res.download('')
})

module.exports = router;