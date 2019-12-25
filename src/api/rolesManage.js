import request from '@/utils/request'

export function getRoutes(params) {
  return request({
    url: 'role/all',
    method: 'get',
    params,
  })
}
