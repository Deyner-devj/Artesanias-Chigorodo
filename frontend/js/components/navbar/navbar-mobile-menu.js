function initNavbarMobileMenu() {
  const mobileBtn = document.getElementById("mobile-menu-btn");
  const menuContainer = document.getElementById("navbar-menu-container");
  const hamburgerIcon = document.getElementById("hamburger-icon");
  const closeIcon = document.getElementById("close-icon");

  if (mobileBtn && menuContainer) {
    mobileBtn.addEventListener("click", function () {
      const isOpen = menuContainer.classList.contains("mobile-active");
      if (isOpen) {
        menuContainer.classList.remove("mobile-active");
        if (hamburgerIcon) hamburgerIcon.style.display = "block";
        if (closeIcon) closeIcon.style.display = "none";
      } else {
        menuContainer.classList.add("mobile-active");
        if (hamburgerIcon) hamburgerIcon.style.display = "none";
        if (closeIcon) closeIcon.style.display = "block";
      }
    });
  }

  const categoryTrigger = document.getElementById("categories-dropdown-trigger");
  const categoryMenu = document.getElementById("categories-dropdown-menu");
  if (categoryTrigger && categoryMenu) {
    categoryTrigger.addEventListener("click", function (e) {
      e.stopPropagation();
      const isVisible = categoryMenu.style.display === "block";
      categoryMenu.style.display = isVisible ? "none" : "block";
    });

    document.addEventListener("click", function (e) {
      if (!categoryTrigger.contains(e.target)) {
        categoryMenu.style.display = "none";
      }
    });
  }
}
