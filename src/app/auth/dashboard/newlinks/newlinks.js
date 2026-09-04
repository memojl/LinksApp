import { getData, createData, putData, deleteData, getDataById } from '../../../services/firebase';
import { variables } from '../../../core/lib';
import { consoleLocal, getFormData, resetForm, btnBorrar, btnCancelar, toggleTitle, fillForm, tooltips, closeModal } from '../../../functions';
import { handleEventListener } from '../../../hooks/handleEventListener';
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
        handleEventListener("click", () => {
            buscar.value = null;
            buscar.placeholder = 'Buscar...';
            links();
        }, btnR);
    };

    const btnBuscar = () => {
        const buscar = document.querySelector('#buscar');
        const btnB = document.querySelector('#button-addon2');
        if (!btnB) { return; }
        handleEventListener("click", () => {
            links(buscar.value, 'btnB');
        }, btnB);
    };

    const filtrar = () => {
        const buscar = document.querySelector('#buscar');
        const listaCate = document.querySelector('#listaCate');
        if (!listaCate) { return; }
        handleEventListener("click", (e) => {
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
        if (!data || !listaCate) { return }
        const categorias = [...new Set(data.map(item => item.cate))].sort(); consoleLocal('log', categorias);
        for (let i = 0; i < categorias.length; i++) {
            html += `<li><a class="dropdown-item">${categorias[i]}</a></li>`
        }
        listaCate.innerHTML = html;
    };

    const btnAgregar = () => {
        handleEventListener("click", (e) => {
            const btn = e.target.closest(".btnAdd");
            if (!btn) return;
            localStorage.setItem("Mode", "add");
            const user = JSON.parse(localStorage.getItem('userBasic'));
            document.querySelector("#create_at").value = fecha;
            document.querySelector("#uid").value = user.uid;
            toggleTitle();
        })
    };

    const btnEditar = () => {
        handleEventListener("click", async (e) => {
            const btn = e.target.closest(".btnEdit");
            if (!btn) return;
            const key = btn.getAttribute("data-id");
            console.log("Editar:", key);
            localStorage.setItem("Mode", "edit");
            localStorage.setItem("Key", key);
            const item = await getDataById(tab, key);
            if (!item) { return; }
            toggleTitle();
            fillForm(item);
            //document.querySelector("#update_at").value = fecha;
        });
    };

    const btnGuardar = () => {
        const form = document.querySelector("#save-form");
        if (!form) return;
        handleEventListener("submit", async (e) => {
            e.preventDefault();
            const mode = localStorage.getItem("Mode");
            if (!mode) return;
            console.log("Mode:", mode);
            const body = getFormData(form, "id"); //console.log(body);
            if (mode == "add") {
                createData(tab, body);
            } else {
                const key = localStorage.getItem("Key");
                if (!key) return;
                putData(tab, key, body);
            }
            resetForm("#save-form");
            setTimeout(() => { links(); }, 500);
            closeModal();
        }, form);
    }

    const links = async (q = '', control = '') => {
        const newlinksList = document.querySelector("#links-list");
        if (!newlinksList) return;
        const user = JSON.parse(localStorage.getItem('userBasic'));
        const inputID = document.querySelector("#Id");
        //* REGISTROS ********************* */
        const registros = await getData(tab); consoleLocal('log', registros);
        const newId = Math.max(0, ...(registros ?? [])
            .map(item => Number(item?.ID)).filter(Number.isFinite)) + 1; consoleLocal('log', `Nuevo ID: ${newId}`);
        //* DATOS FILTRADOS POR UID Y BUSCADOR ********************* */
        const datos = registros.filter(item => item?.uid === user.uid)
            .sort((a, b) => Number(a.ID) - Number(b.ID));
        const campo = control === 'btnB' ? 'title' : 'cate';
        const buscado = datos?.filter(item => item[campo] === q);
        //* DATA ********************* */
        const data = q ? buscado : datos; consoleLocal('log', data);
        localStorage.removeItem("Key");
        if (!data || data?.length == 0) {
            inputID.value = 1;
            newlinksList.innerHTML = '<p class="text-center">No hay links disponibles.</p>';
            return;
        }
        listaFiltro(datos);
        mostrarBuscador(datos.length);
        //Cards
        const html = data.map(linksHTML).join("");
        //
        inputID.value = newId;
        console.log('Registros encontrados:', data.length);
        newlinksList.innerHTML = data.length == 0 ? `<p class="text-center">0 links disponibles.</p>` : '<div class="links-grid">' + html + '<div>';
        //tooltips();
    };

    function linksHTML(item) {
        var { Id, key, title, link, desc, cate, activo } = item;
        return `
        <!--Card ID: ${Id}-->
            <div key="${key}" class="link-card">
                <span class="status ${activo ? 'online' : 'offline'}"></span>
                <div class="card-icon">
                    <i class="bi bi-globe2"></i>
                </div>
                ${link ? `<a href="${link}" target="_blank"><h4>${title}</h4></a>` : `<h4>${title}</h4>`}
                <span class="badge web">${cate}</span>
                <div class="card-actions">
                    <button data-id="${key}" class="btn-action edit btnEdit" data-bs-toggle="modal" data-bs-target="#Modal">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button data-id="${key}" class="btn-action delete btnDelete">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        <!--/Card-->
        `;
    }

    const mostrarBuscador = (n) => {
        const showLimit = document.querySelectorAll('.showLimit');
        if (showLimit) {
            for (const item of showLimit) {
                item.style.display = (n > 1) ? 'flex' : 'none';
            }
        }
    };

    const onLoad = () => {
        btnGuardar();
        btnAgregar();
        btnEditar();
        btnBuscar();
        btnReset();
        //BOTONES CONFIGURACION
        btnBorrar(tab, () => { links(); });
        btnCancelar(() => { console.warn('Cancelado!!!', tab); resetForm("#save-form"); links(); });
        setTimeout(() => { links(); filtrar(); }, 1000);
    }

    setTimeout(onLoad, 0);
    return Html;
}