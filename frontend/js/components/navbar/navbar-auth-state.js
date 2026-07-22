function initNavbarAuthState() {
  const userTrigger = document.getElementById("user-menu-trigger");
  const userMenu = document.getElementById("user-dropdown-menu");
  const favsLink = document.getElementById("favs-menu-link");
  const logoutLink = document.getElementById("logout-menu-link");

  if (userTrigger && userMenu) {
    userTrigger.addEventListener("click", function (e) {
      e.stopPropagation();
      const isVisible = userMenu.classList.contains("is-active");
      if (isVisible) {
        userMenu.classList.remove("is-active");
      } else {
        userMenu.classList.add("is-active");
        const categoryMenu = document.getElementById("categories-dropdown-menu");
        if (categoryMenu) categoryMenu.style.display = "none";
      }
    });

    document.addEventListener("click", function (e) {
      if (!userTrigger.contains(e.target) && !userMenu.contains(e.target)) {
        userMenu.classList.remove("is-active");
      }
    });
  }

  if (favsLink) {
    favsLink.addEventListener("click", function (e) {
      e.preventDefault();
      const user = getLoggedInUser();
      const path = window.location.pathname.toLowerCase();
      const isSubfolder =
        path.includes("/home/") ||
        path.includes("/cliente/") ||
        path.includes("/admin/") ||
        path.includes("/artesano/");
      const rootPrefix = isSubfolder ? "../" : "";

      if (!user) {
        window.location.href = `${rootPrefix}home/login.html?redirect=favoritos`;
      } else {
        window.location.href = `${rootPrefix}cliente/favoritos.html`;
      }
    });
  }

  if (logoutLink) {
    logoutLink.addEventListener("click", function (e) {
      e.preventDefault();
      if (typeof logoutUser === "function") {
        logoutUser();
      } else {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("auth_token");
        window.location.reload();
      }
    });
  }
}
