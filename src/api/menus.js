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