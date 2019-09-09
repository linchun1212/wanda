import Vue from "vue";
import Router from "vue-router";
import Citys from "./views/Citys.vue";
import Cinemas from "./views/Cinemas.vue";
import Home from "./views/Home.vue";
import Movie from "./components/Movie.vue";
import Saler from "./components/Saler.vue";
import Person from "./components/Person.vue";
import MovieDetail from "./views/MovieDetail.vue";
import TakeTick from "./views/TakeTick.vue";
import Map from "./views/Map.vue";

Vue.use(Router);

var router = new Router({
  routes: [
    {
      path: "/",
      name: "city",
      component: Citys
    },
    {
      path: "/cinemas",
      name: "cinemas",
      component: Cinemas
    },
    {
      path: "/home",
      component: Home,
      children: [
        { path: "/", redirect: "movie", name: "home" },
        { path: "/movie", name: "movie", component: Movie },
        { path: "/saler", name: "saler", component: Saler },
        { path: "/person", name: "person", component: Person }
      ]
    },
    {
      path: "/moviedetail",
      name: "moviedetail",
      component: MovieDetail
    },
    {
      path: "/taketick",
      name: "taketick",
      component: TakeTick
    },
    {
      path: "/map",
      name: "map",
      component: Map
    }
  ]
});
// router.beforeEach((to, from, next) => {
//   if (from.path == "/") router.replace({ name: "movie" });
// });

export default router;
