import store from "@/store";
import router from "@/router";

let vars = {
  app_title: store.state.app_title
};

let fun = {
  loadView(name) {
    return function(resolve) {
      require([`@/views/${name}.vue`], resolve);
    };
  },
  isCurrentRoute(name) {
    let index = store.state.current_route;
    return store.state.routes[index].name == name;
  },
  setRouter(r) {
    console.log(r);
  },
  return_defaults() {
    document.title = vars.app_title;
    store.commit("setRouterTitle", "");
  },
  currentUser() {
    return store.state.currentUser;
  },
  setCurrentUser(user, reload = false) {
    store.commit("setCurrentUser", user);
    // store.state.app.loading = true;
    // store.state.app.loading = false;
    // if (reload) {
    //   if (router.history.current.fullPath !== "/") {
    //     router.push("/");
    //   }
    //   let href = document.location.href;
    //   document.location.href = href;
    // }
  },
  setRouterObj(current = "", before = "") {
    store.commit("setRouterObj", {
      current,
      before
    });
  },
  setNewRoute(r) {
    store.commit("setNewRoute", r);
  },
  commit(to, val) {
    return store.commit(to, val);
  }
};

export { fun, vars };
