接口数据mock [在线项目](http://119.29.101.122:3000/)
# start
> window需要安装sqlite
### dev
```js
npm i && node server/index.js //localhost:3000
```
### deploy
```
npm run build && npm run start:pro
```

---
- express
- sqlite
- nextjs
- react

## 报错
 > cannt not read property 'map' of undefinded  

server/mock/app.sqlite数据有问题，复制server/db/app.sqlite覆盖掉
