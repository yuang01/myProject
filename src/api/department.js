import request from '@/utils/request'

export function getDepartments(params) {
  return request({
    url: 'department/all',
    method: 'get',
    params,
  })
}

export function update(data) {
  return request({
    url: 'department/update',
    method: 'post',
    data,
  })
}

export function create(data) {
  return request({
    url: 'department/create',
    method: 'post',
    data,
  })
}