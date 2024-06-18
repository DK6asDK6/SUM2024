export function onSubmit() {
  let user = document.getElementById("log").value;

  window.localStorage.setItem("user", user);
}
