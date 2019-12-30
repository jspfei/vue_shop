const Mock = require('mockjs');
var userJson = require('./json/users');
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
  var jsonstr = userJson;
  // var userslist = JSON.parse(jsonstr);
  var data = JSON.parse(option.body)
  if (data.params.query != '') {
    var users = jsonstr.data.users;
    for (var i = 0; i < users.length; i++) {

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

  var jsonstr = userJson
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

//添加用户
Mock.mock('users/adduser', 'post', (option) => {
  var jsonstr = userJson
  var data = JSON.parse(option.body)

  var user = data
  user.role_name = "超级管理员";
  user.id = 502;
  user.create_time = 1577535220;
  user.mg_state = true;
  jsonstr.data.users.push(user)
  return jsonstr;
})

//查询用户
Mock.mock('users/getuser', "post", (option) => {
  var jsonstr = userJson;
  var data = JSON.parse(option.body)
  var id = data.id;
  var users = jsonstr.data.users;
  var user = null;
  for (var i = 0; i < jsonstr.data.users.length; i++) {
    if (jsonstr.data.users[i].id == id) {
      user = users[i];
      break;
    }
  }
  jsonstr.data.users = [user];
  jsonstr.msg = "查询用户成功"
  return jsonstr;
})


//修改用户信息
Mock.mock('users/edit', 'post', (option) => {
  var jsonstr = userJson;
  var data = JSON.parse(option.body)
  for (var i = 0; i < jsonstr.data.users.length; i++) {
    if (jsonstr.data.users[i].id != data.id) {
      jsonstr.data.users[i].email = data.email;
      jsonstr.data.users[i].mobile = data.mobile;
    }
  }

  jsonstr.msg = "修改用户成功"

  return jsonstr;
})

//删除用户信息
Mock.mock('users/delete', 'post', (option) => {
  var jsonstr = userJson;
  var data = JSON.parse(option.body)
  var users = jsonstr.data.users;
  for (var i = 0; i < users.length; i++) {
    if (jsonstr.data.users[i].id != data.id) {
      users.splice(i, 1);
    }

  }
  jsonstr.data.users = users;
  jsonstr.msg = "查询用户成功"
  return jsonstr;
})




export default Mock;