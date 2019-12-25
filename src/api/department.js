import request from '@/utils/request'

export function getDepartments(params) {
  return request({
    url: 'department/all',
    method: 'get',
    params,
  })
}

