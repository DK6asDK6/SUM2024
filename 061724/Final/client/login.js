window.addEventListener("load", () => {
  let user = window.localStorage.getItem("user");
  if (user) window.location = ""; // to game choose
});

export function registerClick() {
  // window.localStorage.setItem("register", false);
  window.location = "./register/"; // to registration
}

export function loginClick() {
  // window.localStorage.setItem("register", true);
  window.location = "./login/"; // to login
}

// remember: window.location = "url-to-html"
