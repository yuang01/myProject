import request from '@/utils/request'
// import qs from 'qs';

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
// 创建用户
export function createUser(data) {
  return request({
    url: '/user/create',
    method: 'post',
    data
  })
}
// 更新用户
export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}
// 获取所有用户，或者通过条件赛选用户
export function allUser(query) {
  return request({
    url: '/user/all',
    method: 'get',
    params: query
  })
}
// 删除用户
export function destroy(id) {
  return request({
    url: '/user/destroy',
    method: 'get',
    params: { id }
  })
}
