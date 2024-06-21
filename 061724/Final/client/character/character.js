export function onLoad() {
  let name = window.sessionStorage.getItem("user");
  if (name == undefined) name = window.localStorage.getItem("user");

  document.getElementsByName("info")[0].value = name;
}
