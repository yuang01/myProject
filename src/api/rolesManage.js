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
