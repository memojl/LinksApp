import { getData, createData, putData, deleteData, getDataById } from '../../../services/firebase';
import { variables } from '../../../core/lib';
import { closeModal, consoleLocal, getFormData, resetForm, fillForm, btnBorrar, btnCancelar, toggleTitle } from '../../../functions';
import { handleEventListener } from '../../../hooks/handleEventListener';
import Swal from 'sweetalert2';
import Html from './index.html?raw';

export function linksDashboard() {
    const tab = "links";
    const { fecha } = variables();

    const btnAgregar = () => {
        handleEventListener("click", async (e) => {
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
            closeModal();//*CERRAR MODAL
        }, form);
    }

    const links = async () => {
        const linksList = document.querySelector("#product-list");
        if (!linksList) return;
        const user = JSON.parse(localStorage.getItem('userBasic'));
        const inputID = document.querySelector("#Id");
        //* REGISTROS ********************* */
        const registros = await getData(tab); consoleLocal('log', registros);
        const newId = Math.max(0, ...(registros ?? [])
            .map(item => Number(item?.Id)).filter(Number.isFinite)) + 1; consoleLocal('log', `Nuevo ID: ${newId}`);
        //* DATOS FILTRADOS POR UID Y BUSCADOR ********************* */
        const datos = registros.filter(item => item?.uid === user.uid)
            .sort((a, b) => Number(a.ID) - Number(b.ID));
        //* DATA ********************* */
        const data = datos; consoleLocal('log', data);
        localStorage.removeItem("Key");
        if (!data) {
            inputID.value = 1;
            linksList.innerHTML = '<p class="text-center">No hay links disponibles.</p>';
            return;
        }
        //Cards
        const html = data.map(cardHTML).join("");
        //
        inputID.value = newId;
        console.log('Registros encontrados:', data.length);
        linksList.innerHTML = data.length == 0 ? `<p class="text-center">No hay links disponibles.</p>` : html;
    };

    function cardHTML(item) {
        const { Id,key, title, link, desc, cate, create_at, activo } = item;
        return `
        <!--Card ID: ${Id}-->
            <div class="col-md-3">
              <div class="card" key="${key}" style="width: 96%">
                <img src="./assets/img/webpage.jpg" class="card-img-top" alt="">
                <div class="card-body">
                    ${link ? `<a href="${link}" target="_blank"><h5 class="card-title">${title}</h5></a>` : `<h5 class="card-title">${title}</h5>`}
                    <p class="m-2">${cate} - ${create_at}</p>
                    <p class="card-text">${desc}</p>
                    <span>${activo ? 'Activo' : 'Inactivo'}</span>
                    <button type="button" data-id="${key}" class="btn btn-primary mb-3 btnEdit" data-bs-toggle="modal" data-bs-target="#Modal">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button type="button" data-id="${key}" class="btn btn-danger mb-3 btnDelete">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
              </div>
            </div>
        <!--/Card-->
        `;
    }

    const onLoad = () => {
        btnGuardar();
        btnAgregar();
        btnEditar();
        //BOTONES CONFIGURACION
        btnBorrar(tab, () => { links(); });
        btnCancelar(() => { console.warn('Cancelado!!!', tab); resetForm("#save-form"); links(); });
        setTimeout(() => { links(); }, 1000);
    }

    setTimeout(onLoad, 0);
    return Html;
}