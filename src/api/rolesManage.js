import request from '@/utils/request'

export function getRoles(params) {
  return request({
    url: 'role/all',
    method: 'get',
    params,
  })
}

export function updateRole(data) {
  return request({
    url: '/role/update',
    method: 'post',
    data
  })
}

export function createRole(data) {
  return request({
    url: '/role/create',
    method: 'post',
    data
  })
}

export function destroyRole(id) {
  return request({
    url: '/role/destroy',
    method: 'get',
    params: { id }
  })
}