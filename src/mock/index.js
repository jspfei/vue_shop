const Mock = require('mockjs');
Mock.mock('user/userInfo', 'post', (option) => {
  //请求参数
  console.log(option)
  return require('./json/userInfo');
})

Mock.mock('user/bannerList', 'get', (option) => {
  //请求参数
  console.log(option)
  return require('./json/userInfo');
})

export default Mock;