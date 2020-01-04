import ApiPath from "@/api/ApiPath"
const Mock = require('mockjs');
var userJson = require('./json/users');
var rolesJson = require('./json/roles');
var rightsTreeJson = require('./json/rightstree');
var paramsJson = require('./json/params')
var goodsJson = require('./json/goods')
var cateJson = require('./json/cate')

var tree = require('./json/tree');
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
//更改用户权限
Mock.mock('users/role', 'post', (option) => {
  var data = JSON.parse(option.body)
  console.log(data)
  var jsonstr = userJson;
  //获取权限
  var roleName = ''
  for (var j = 0; j < rolesJson.data.length; j++) {
    var role = rolesJson.data[j];
    if (role.id == data.roleid) {
      roleName = role.roleName;
      break;
    }
  }
  //修改用户权限
  for (var i = 0; i < userJson.data.users.length; i++) {
    var user = userJson.data.users[i];
    if (user.id = data.userid) {
      user.role_name = roleName;
      break;
    }
  }
  jsonstr.msg = "更改用户信息成功"
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


//获取权限列表
Mock.mock('rights/list', 'get', (option) => {

  return require('./json/rights');;
})

//获取角色列表
Mock.mock('rights/roles', 'get', (option) => {

  return rolesJson;
})

//删除角色权限
Mock.mock('rights/delete', 'post', (option) => {
  var jsonstr = rolesJson;
  var data = JSON.parse(option.body)
  console.log(data)
  var selectIndex = 0;
  for (var i = 0; i < jsonstr.data.length; i++) {
    var item = jsonstr.data[i];
    if (item.id == data.roleid) {
      selectIndex = i;
      for (var j = 0; j < item.children.length; j++) {
        var subItem = item.children[j];
        if (subItem.id == data.rightid) {
          item.children.splice(j, 1);
          break;
        } else {
          for (var z = 0; z < subItem.children.length; z++) {
            var rightsItem = subItem.children[z];
            if (rightsItem.id == data.rightid) {
              subItem.children.splice(z, 1);
              break;
            } else {
              for (var k = 0; k < rightsItem.children.length; k++) {
                var subrightsItem = rightsItem.children[k]
                if (subrightsItem.id == data.rightid) {
                  rightsItem.children.splice(k, 1);
                  break;
                }
              }
            }


          }
        }

      }
      break;
    }
  }

  jsonstr.result = jsonstr.data[selectIndex];
  return jsonstr;
});

//获取权限树
Mock.mock('rights/tree', 'get', (option) => {
  rightsTreeJson.data = require('./json/tree')
  return rightsTreeJson;
})

function find(arr, fn) {
  for (var i = arr.length; i > 0; i--) {
    var item = arr[i - 1];
    if (fn(item)) {
      arr.splice(i - 1, 1);
    } else {
      if (arr[i - 1].children) {
        find(arr[i - 1].children, fn)
      }
    }
  }
}
function add(arr, fn, data) {
  for (var i = 0; i < arr.length; i++) {
    var item = arr[i];
    if (fn(item)) {
      item.children.push(data);
      break;
    } else {
      if (arr[i].children) {
        add(arr[i].children, fn, data)
      }
    }
  }
}
//给角色分配权限
Mock.mock('roles/rights', 'post', (option) => {
  var data = JSON.parse(option.body);
  var roleid = data.roleid;
  var ids = data.ids;

  //权限树
  var roleRights = require("./json/tree");


  //在所有权限列表中，过滤出用户包含的权限
  var newArr = find(roleRights, item => {
    return ids.indexOf(item.id) == -1
  })


  //角色列表，根据角色id替换权限
  var jsonstr = rolesJson;
  for (var i = 0; i < jsonstr.data.length; i++) {
    var item = jsonstr.data[i];
    if (item.id == this.roleid) {
      item.children = newArr;
    }
  }
  console.log(jsonstr)
  return jsonstr;
})


//获取商品分类数据
Mock.mock(RegExp(ApiPath.goods.catePath + ".*"), 'get', (options) => {
  console.debug(ApiPath.goods.catePath, options);
  var jsonstr = require('./json/good_cate')
  jsonstr.data.cate = cateJson;

  return jsonstr
})
function clone(arr) {
  return [].concat(arr);
}
//获取父级分类列表
Mock.mock(RegExp(ApiPath.goods.parentCatePath), 'get', (options) => {
  var jsonstr = require('./json/result')
  var parrencate = require('./json/parentcate')

  jsonstr.data = parrencate;

  jsonstr.msg = "获取父级分类列表成功"
  return jsonstr;
})

//添加分类
Mock.mock(RegExp(ApiPath.goods.addCatePath), 'post', (options) => {
  var data = JSON.parse(options.body)
  var jsonstr = require('./json/result')
  var subdata = {
    "cate_id": data.cate_id,
    "cate_name": data.cate_name,
    "cate_pid": 0,
    "cate_level": data.cate_level,
    "cate_deleted": false,
  }
  add(cateJson, item => {
    return item.cate_id == subdata.cate_id
  }, subdata)
  jsonstr.data = cateJson;

  jsonstr.msg = "添加数据成功"
  return jsonstr;
})

//请求分类参数
Mock.mock(RegExp(ApiPath.goods.paramsPath), 'post', (options) => {

  var jsonstr = require('./json/result')
  var params = JSON.parse(options.body);
  var cate_id = params.id;
  var sel = params.sel;
  var data = [];

  for (var i = 0; i < paramsJson.length; i++) {
    var item = paramsJson[i];
    if (cate_id == item.cate_id && sel == item.attr_sel) {
      data.push(item)
    }
  }

  jsonstr.data = data
  jsonstr.msg = "获取分类参数成功"

  return jsonstr;
})

//添加参数


Mock.mock(RegExp(ApiPath.goods.attributesPath), 'post', (options) => {

  var jsonstr = require('./json/result')
  var params = JSON.parse(options.body);

  var newItem = {
    "attr_id": 1150,
    "attr_name": params.attr_name,
    "cate_id": params.cate_id,
    "attr_sel": params.attr_sel,
    "attr_writhe": "manual",
    "attr_vals": params.attr_vals,
  }
  paramsJson.push(newItem)


  jsonstr.data = newItem
  jsonstr.msg = "添加分类参数成功"

  return jsonstr;
})

//修改分类参数
Mock.mock(RegExp(ApiPath.goods.paramsPath), 'post', (options) => {

  var jsonstr = require('./json/result')
  var params = JSON.parse(options.body);
  var cate_id = params.id;
  var sel = params.sel;
  var data = [];

  for (var i = 0; i < paramsJson.length; i++) {
    var item = paramsJson[i];
    if (cate_id == item.cate_id && sel == item.attr_sel) {
      data.push(item)
    }
  }

  jsonstr.data = data
  jsonstr.msg = "获取分类参数成功"

  return jsonstr;
})

//修改分类参数


Mock.mock(RegExp(ApiPath.goods.updatePath), 'post', (options) => {

  var jsonstr = require('./json/result')
  var params = JSON.parse(options.body);


  for (var i = 0; i < paramsJson.length; i++) {
    var item = paramsJson[i];
    if (params.attr_id == item.attr_id) {
      paramsJson[i] = params;
    }
  }


  jsonstr.data = params
  jsonstr.msg = "添加分类参数成功"

  return jsonstr;
})

//删除分类参数


Mock.mock(RegExp(ApiPath.goods.deletePath), 'post', (options) => {

  var jsonstr = require('./json/result')
  var params = JSON.parse(options.body);


  for (var i = 0; i < paramsJson.length; i++) {
    var item = paramsJson[i];
    if (params.attr_id == item.attr_id) {
      paramsJson.splice(i, 1)
      break;
    }
  }


  jsonstr.data = params
  jsonstr.msg = "删除分类参数成功"

  return jsonstr;
})

//获取商品列表
Mock.mock(RegExp(ApiPath.goods.goodsPath), 'post', (options) => {
  var data = JSON.parse(options.body)
  var size = data.pagesize;
  var num = data.pagenum
  var jsonstr = require('./json/result')
  var returnJson = [];
  var startIndex = (num - 1) * size;
  var endIndex = (num * size) > goodsJson.length ? goodsJson.length : (num * size);
  for (var i = startIndex; i < endIndex; i++) {
    returnJson.push(goodsJson[i])
  }

  jsonstr.data = returnJson;
  jsonstr.total = 17;
  jsonstr.msg = "获取商品列表成功"
  return jsonstr;
})




export default Mock;