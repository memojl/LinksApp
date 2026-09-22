import { body, theme } from "../core/constants";
/* ==========================
  TEMA
========================== */
const tema = 'links';//DEFAULT

export const temaHome = () => {
    const m = document.querySelector('.masthead');
    const t1 = document.querySelector('.index');
    const t2 = document.querySelector('.hero');
    if (theme == tema) {
        t2.style.display = 'none';
        m.style.position = 'inherit';
    } else {
        t1.style.display = 'none';
    }
};

export const temaLog = () => {
    const t1 = document.querySelector('.container');
    const t2 = document.querySelector('.login-page');
    if (theme == tema) {
        t2.style.display = 'none';
    } else {
        t1.style.display = 'none';
    }
};

export const temaBgColor = ({ mod }) => {
    const modulos = mod == 'Home';
    if (modulos && theme == tema) {
        body.style.background = '#050505';
    } else {
        body.style.background = '#fff';
    }
};