import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { alertMessage, showMessage } from "./messages";

export function logoutApp() {
  const logout = document.querySelector("#logout"); //console.log(logout);
  if (logout) {
    logout.addEventListener("click", async (e) => {
      //console.log('LogOut',e);
      e.preventDefault();
      try {
        await signOut(auth);
        console.log("Logout/Salir");
        localStorage.clear();
        var token = localStorage.getItem("Token");
        if (token == null) {
          console.warn("TOKEN CLEAR");
          //setTimeout(function(){window.location.href='#/';},3000);
        }
        showMessage("Signup out", "info");
      } catch (error) {
        console.log(error);
      }
    });
  }
}
