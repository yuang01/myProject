import request from '@/utils/request'

export function getMenusByRoleId(id) {
  return request({
    url: '/menu/getMenusByRoleId',
    method: 'get',
    params: { id }
  })
}

export function getMenus() {
  return request({
    url: '/menu/getMenus',
    method: 'get',
  })
}

export function getMenusByRoleName(params) {
  return request({
    url: '/menu/getMenusByRoleName',
    method: 'get',
    params
  })
}

export function addMenu(data) {
  return request({
    url: '/menu/addMenu',
    method: 'post',
    data
  })
}

export function getMenuById(params) {
  return request({
    url: '/menu/getMenuById',
    method: 'get',
    params
  })
}

export function updateMenu(data) {
  return request({
    url: '/menu/updateMenu',
    method: 'post',
    data
  })
}

export function deleteMenu(params) {
  return request({
    url: '/menu/deleteMenu',
    method: 'get',
    params
  })
}
