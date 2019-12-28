const Mock = require('mockjs');
//登录
Mock.mock('login', 'post', (option) => {
  //请求参数
  console.log(option)
  return require('./json/login');
})
//menu列表
Mock.mock('menus', 'get', (option) => {
  //请求参数
  console.log(option)
  return require('./json/menus');
})
//用户信息

Mock.mock('users', 'post', (option) => {
  //请求参数
  console.log("" + option.data)
  var jsonstr = require('./json/users');
  // var userslist = JSON.parse(jsonstr);
  var data = JSON.parse(option.body)
  if (data.params.query != '') {
    var users = jsonstr.data.users;
    for (var i = 0; i < users.length; i++) {
      console.log(users[i].username)
      if (data.params.query != users[i].username) {
        users.splice(i, 1);
      }

    }
    jsonstr.data.users = users;
    jsonstr.msg = "查询用户成功"
    return jsonstr;
  }

  var size = data.params.pagesize;
  var pagenum = data.params.pagenum;
  if (size >= jsonstr.data.users.length) {
    for (var i = 2; i < size; i++) {
      var index = pagenum % 2 == 0 ? 0 : 1;
      var user = jsonstr.data.users[index];
      user.id = user.id + i;
      jsonstr.data.users.push(user)
    }
  }

  return jsonstr;
})

//更新用户状态



Mock.mock('users/updatestate', 'post', (option) => {
  //请求参数

  var jsonstr = require('./json/users');
  var data = JSON.parse(option.body)
  var id = data.userid;
  var state = data.state;
  for (var i = 0; i < jsonstr.data.users.length; i++) {
    if (jsonstr.data.users[i].id = id) {
      jsonstr.data.users[i].mg_state = state;
    }
  }
  jsonstr.msg = "更改用户状态成功"

  return jsonstr;
})
export default Mock;