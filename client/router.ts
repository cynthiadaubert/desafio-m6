import { welcomePage } from "./pages/welcome";
import { newGamePage } from "./pages/new-game";
import { openRoomPage } from "./pages/open-room";
import { shareCodePage } from "./pages/share-code";
import { instructionsPage } from "./pages/instructions";
import { loadingGamePage } from "./pages/loading-game";
import { playPage } from "./pages/play";
import { handsPage } from "./pages/show-hands";
import { resultsPage } from "./pages/results";
import { errorPage } from "./pages/error";

const BASE_PATH = "/desafio-m5";

function isGithubPages() {
  return location.host.includes("github.io");
}

const routes = [
  {
    path: /\/welcome/,
    component: welcomePage,
  },
  {
    path: /\/newgame/,
    component: newGamePage,
  },
  {
    path: /\/openroom/,
    component: openRoomPage,
  },
  {
    path: /\/sharecode/,
    component: shareCodePage,
  },
  {
    path: /\/instructions/,
    component: instructionsPage,
  },
  {
    path: /\/loading/,
    component: loadingGamePage,
  },
  {
    path: /\/play/,
    component: playPage,
  },

  {
    path: /\/showhands/,
    component: handsPage,
  },

  {
    path: /\/results/,
    component: resultsPage,
  },

  {
    path: /\/error/,
    component: errorPage,
  },
];

export function initRouter(container: Element) {
  function goTo(path) {
    const completePath = isGithubPages() ? BASE_PATH + path : path;
    history.pushState({}, "", completePath);
    handleRoute(completePath);
  }
  function handleRoute(route) {
    const newRoute = isGithubPages() ? route.replace(BASE_PATH, "") : route;
    for (const r of routes) {
      if (r.path.test(newRoute)) {
        const elem = r.component({ goTo: goTo });
        if (container.firstChild) {
          container.firstChild.remove();
        }
        container.appendChild(elem as any);
      }
    }
  }

  if (location.pathname == "/desafio-m5/") {
    goTo("/welcome");
  } else {
    handleRoute(location.pathname);
  }

  ///ESCUCHA LOS CAMBIOS PARA PODER NAVEGAR POR EL HISTORIAL///

  window.onpopstate = function () {
    handleRoute(location.pathname);
  };
}
