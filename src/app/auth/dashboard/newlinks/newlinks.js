import { getData, createData, putData, deleteData, getDataById } from '../../../services/firebase';
import { variables } from '../../../core/lib';
<<<<<<< HEAD:src/app/auth/dashboard/links/links.js
import { consoleLocal, getFormData, tooltips } from '../../../functions';
=======
import { consoleLocal, getFormData, handleEventListener, tooltips } from '../../../functions';
>>>>>>> Ext:src/app/auth/dashboard/newlinks/newlinks.js
import Swal from 'sweetalert2';
import Html from './index.html?raw';
import './style.css';

export function newlinksDashboard() {
    const tab = "links";
    const { fecha } = variables();

    const btnReset = () => {
        const buscar = document.querySelector('#buscar');
        const btnR = document.querySelector('.btnReset');
        if (!btnR) { return; }
<<<<<<< HEAD:src/app/auth/dashboard/links/links.js
        btnR.addEventListener("click", () => {
            buscar.value = null;
            buscar.placeholder = 'Buscar...';
            links();
        });
=======
        handleEventListener("click", () => {
            buscar.value = null;
            buscar.placeholder = 'Buscar...';
            links();
        }, btnR);
>>>>>>> Ext:src/app/auth/dashboard/newlinks/newlinks.js
    };

    const btnBuscar = () => {
        const buscar = document.querySelector('#buscar');
        const btnB = document.querySelector('#button-addon2');
        if (!btnB) { return; }
<<<<<<< HEAD:src/app/auth/dashboard/links/links.js
        btnB.addEventListener("click", () => {
            links(buscar.value, 'B');
        });
=======
        handleEventListener("click", () => {
            links(buscar.value, 'B');
        }, btnB);
>>>>>>> Ext:src/app/auth/dashboard/newlinks/newlinks.js
    };

    const filtrar = () => {
        const buscar = document.querySelector('#buscar');
        const listaCate = document.querySelector('#listaCate');
        if (!listaCate) { return; }
<<<<<<< HEAD:src/app/auth/dashboard/links/links.js
        listaCate.addEventListener("click", (e) => {
=======
        handleEventListener("click", (e) => {
>>>>>>> Ext:src/app/auth/dashboard/newlinks/newlinks.js
            const opc = e.target.closest("a");
            if (!opc) { return; }
            buscar.value = null;
            buscar.placeholder = opc.textContent;
            links(opc.textContent);
        }, listaCate);
    };

    const listaFiltro = (data) => {
        let html = '';
        const listaCate = document.querySelector('#listaCate');
<<<<<<< HEAD:src/app/auth/dashboard/links/links.js
        if (!data) { return }
        const categorias = [...new Set(data.map(item => item.cate))].sort(); consoleLocal('log',categorias);
=======
        if (!data || !listaCate) { return }
        const categorias = [...new Set(data.map(item => item.cate))].sort(); consoleLocal('log', categorias);
>>>>>>> Ext:src/app/auth/dashboard/newlinks/newlinks.js
        for (let i = 0; i < categorias.length; i++) {
            html += `<li><a class="dropdown-item">${categorias[i]}</a></li>`
        }
        listaCate.innerHTML = html;
    };

    const toggleTitle = () => {
        const mode = localStorage.getItem("Mode");
        const tit = document.querySelector('#exampleModalLabel');
        tit.innerHTML = mode == 'edit' ? 'Editar' : 'Nuevo';
    };

    const btnCancelar = () => {
        handleEventListener("click", (e) => {
            const btn = e.target.closest("#btnCancel");
            if (!btn) return;
            console.warn('Cancelado!!!', tab);
            setTimeout(() => { links(); }, 100);
        });
    };

    const btnBorrar = () => {
        handleEventListener("click", (e) => {
            const btn = e.target.closest(".btnDelete");
            if (!btn) return;
            Swal.fire({
                title: "¿Esta seguro eliminar?",
                text: "¡Este cambio sera irreversible!",
                icon: "warning",
                showCancelButton: true,
                cancelButtonColor: "#6c757d",
                cancelButtonText: "Cancelar",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Aceptar",
            }).then((result) => {
                if (result.isConfirmed) {
                    const fila = btn.closest(".link-card");
                    if (!fila) return;
                    const key = fila.getAttribute("key");
                    console.log("Eliminar:", key);
                    deleteData(tab, key);
                    setTimeout(() => { links(); }, 1000);
                    Swal.fire({
                        title: "¡Borrado!",
                        text: "Tu registro ha sido borrado",
                        icon: "success",
                    });
                }
            });
        });
    };

    const btnAgregar = () => {
        handleEventListener("click", (e) => {
            const btn = e.target.closest(".btnAdd");
            if (!btn) return;
            const form = document.querySelector("#save-form");
            form.reset();
            toggleTitle();
        })
    };

    const btnEditar = () => {
        handleEventListener("click", async (e) => {
            const btn = e.target.closest(".btnEdit");
            if (!btn) return;
            const fila = btn.closest(".link-card");
            if (!fila) return;
            const key = fila.getAttribute("key");
            console.log("Editar:", key);
            localStorage.setItem("Mode", "edit");
            localStorage.setItem("Key", key);
            const item = await getDataById(tab, key);
            document.querySelector("#Id").value = item.Id;
            document.querySelector("#title").value = item.title;
            document.querySelector("#link").value = item.link;
            document.querySelector("#desc").value = item.desc;
            document.querySelector("#cate").value = item.cate;
            document.querySelector("#uid").value = item.uid;
            document.querySelector("#create_at").value = item.create_at;
            toggleTitle();
        });
    };

    const btnGuardar = () => {
        const form = document.querySelector("#save-form");
        if (!form) return;
        handleEventListener("submit", async (e) => {
            e.preventDefault();
            const mode = localStorage.getItem("Mode");
            const user = JSON.parse(localStorage.getItem('userBasic'));
            if (!mode && !user) return;
            console.log("Mode:", mode);
            if (mode == 'add') {
                document.querySelector("#create_at").value = fecha;
                document.querySelector("#uid").value = user.uid;
            }
            const body = getFormData(form, "id"); consoleLocal('log',body);
            if (mode == "add") {
                createData(tab, body);
            } else {
                const key = localStorage.getItem("Key");
                if (!key) return;
                putData(tab, key, body);
            }
            setTimeout(() => { links(); }, 1000);
        }, form);
    }

    const links = async (b = '', c = '') => {
        let html = "";
        const datos = await getData(tab);
        listaFiltro(datos);
        const filtrado = c == 'B' ? datos.filter(x => x.title === b) : datos.filter(x => x.cate === b);
<<<<<<< HEAD:src/app/auth/dashboard/links/links.js
        const data = b ? filtrado : datos; consoleLocal('log',data);
        const productList = document.querySelector("#links-list");
=======
        const data = b ? filtrado : datos; consoleLocal('log', data);
        const newlinksList = document.querySelector("#links-list");
        if (!newlinksList) return;
>>>>>>> Ext:src/app/auth/dashboard/newlinks/newlinks.js
        localStorage.removeItem("Key");
        localStorage.setItem("Mode", "add");
        if (data.length == 0 || !data) {
            document.querySelector("#Id").value = 1;
            newlinksList.innerHTML = '<tr><td colspan="5"><p>No hay links disponibles.</p></td></tr>';
            return;
        }
        const user = JSON.parse(localStorage.getItem('userBasic'));
        //Cards
        for (const item of data) {
            var { Id, key, title, link, desc, cate, uid, create_at, activo } = item;
            if (uid == user.uid) {
<<<<<<< HEAD:src/app/auth/dashboard/links/links.js
            html += `
=======
                html += `
>>>>>>> Ext:src/app/auth/dashboard/newlinks/newlinks.js
            <!--Card-->
            <div key="${key}" class="link-card">
                <span class="status ${activo ? 'online' : 'offline'}"></span>
                <div class="card-icon">
                    <i class="bi bi-globe2"></i>
                </div>
                <a href="${link}" target="_blank">
                    <h4>${title}</h4>
                </a>
                <span class="badge web">${cate}</span>
                <div class="card-actions">
                    <button class="btn-action edit btnEdit" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        <i class="bi bi-pencil"></i>
                    </button>

                    <button class="btn-action delete btnDelete">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
            <!--/Card-->
            <!--Card->
            <div key="${key}" class="card item-icon">
              <div class="btn-icon">
                <a href="${link}" target="_blank">
                    <i class="bi bi-globe"></i>
                </a>
                ${activo ? '<i class="bi bi-circle-fill on"></i>' : '<i class="bi bi-circle-fill off"></i>'}
              </div>
              <div class="text-link">
                <h6>
                    <a href="${link}" data-bs-toggle="tooltip" data-bs-placement="top" title="${desc} | ${cate}" target="_blank">
                        ${title}
                    </a>
                </h6>
                <span>
                    <i class="bx bx-pencil btnEdit" data-bs-toggle="modal" data-bs-target="#exampleModal"></i> | 
                    <i class="bx bx-trash btnDelete"></i>
                </span>
              </div>
            </div>
            <!--/Card-->
            `;
            }
        }
        newlinksList.innerHTML = html;
        document.querySelector("#Id").value = Number(Id) + 1;
        //tooltips();
    };

    const onLoad = () => {
        btnGuardar();
        btnAgregar();
        btnEditar();
        btnBorrar();
        btnCancelar();
        btnBuscar();
        btnReset();
        setTimeout(() => { links(); filtrar(); }, 1000);
    }

    setTimeout(onLoad, 0);
    return Html;
}