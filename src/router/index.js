import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import GameView from "@/views/GameView.vue";
import BracketView from "@/views/BracketView.vue";
import RulesView from "@/views/RulesView.vue";
import PrivacyView from "@/views/PrivacyView.vue";
import TermsView from "@/views/TermsView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/game",
    name: "game",
    component: GameView,
  },
  {
    path: "/bracket",
    name: "bracket",
    component: BracketView,
  },
  {
    path: "/rules",
    name: "rules",
    component: RulesView,
  },
  {
    path: "/privacy",
    name: "privacy",
    component: PrivacyView,
  },
  {
    path: "/terms",
    name: "terms",
    component: TermsView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
