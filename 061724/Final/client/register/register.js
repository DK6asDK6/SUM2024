export function onSubmit() {
  let user = document.getElementById("log").value;

  let remember = document.getElementById("rem").checked;

  if (user != "")
    if (remember) window.localStorage.setItem("user", user);
    else window.sessionStorage.setItem("user", user);
}
