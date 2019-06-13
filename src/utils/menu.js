import store from '@/vuex/store'


function menuList(data, path) {
    for (let item of data) {
        item.meta = { name: item.path }
        if (path) {
            item.path = path + "/" + item.path
        } else {
            item.path = "/" + item.path
        }
        if (item.children && item.children.length > 0) {
            let name = item.meta.name.replace("/", "")
            menuList(item.children, item.path);
        }
    }
    return data;
}

export const initRouterNode = (data) => {
    let menulist = menuList(data, "")
    menulist.map((item) => {
        if (item.children && item.children.length > 0) {
            item.children.unshift({
                path: item.path,
                meta: {
                    name: item.meta.name
                }
            })
        }
    })
    store.commit('SET_ROUTERS', menulist);
}