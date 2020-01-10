import { asyncRoutes, constantRoutes, componentMap } from '@/router'
import { getMenusByRoleName } from '@/api/menus'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}
// 将后端返回的conponent替换掉，根据映射
export function filterServiceTreeMenus(data) {
  data.forEach(el => {
    el.component = componentMap[el.component] ? componentMap[el.component] : () => import('@/views/building/index');
    if (el.children) {
      filterServiceTreeMenus(el.children);
    }
  });
  return data;
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      const params = {
        name: JSON.stringify(roles)
      };
      let menus = [];
      getMenusByRoleName(params).then(res => {
        menus = filterServiceTreeMenus(res.data.data);
        menus.push({ path: '*', redirect: '/404', hidden: true });
      }).then(() => {
        commit('SET_ROUTES', menus)
        resolve(menus)
      })
      // 注释部分为原先不用后端请求的route规则
      // let accessedRoutes
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      // commit('SET_ROUTES', accessedRoutes)
      // resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
