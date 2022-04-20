// Componentes: 
import ProyectosAdmins from './ProyectosAdmins'
import ProyectosVoluntarios from './ProyectosVoluntarios'
// Permisos/Roles:
import PuertaPermisos from '../organismos/PuertaPermisos';
import {SCOPES} from '../organismos/map-permisos';
// Librerias-Paquetes:
import {useState, useEffect, useRef} from 'react'
import {useLocation} from "react-router-dom";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function VistaProyectos() {
    // ==== HOOKS ==== 
    const [proyectos, setProyectos] = useState([])
    const [lideres, setLideres] = useState([])
    const [categorias, setCategorias] = useState([])
    const [proyectosPasadosCategoria, setProyectosPasadosCategoria] = useState([])
    const [actualizar, setActualizar] = useState(false)
    const mountedRef = useRef(false) // Bandera para saber si un componente esta desmontado o no, para evitar warning de cancelacion abrubta de llamadas asincronas

    // ==== VARIABLES ====
    let categoria = useQuery().get("categoria");
    let complementoHeader = categoria//categoria? categoria : tipoEstado
    complementoHeader = complementoHeader? complementoHeader : ""
    
    function setProyectosCheck(data, mounted, pasados=false){
        if (mounted) {
            pasados? setProyectosPasadosCategoria(data) : setProyectos(data)
        }
    }
    
    // USE EFFECT
    useEffect(() => {
        mountedRef.current = true
        const getProyectos = async () => {
            try{
                const proyectosDelServer =  await fetchProyectos()
                setProyectosCheck(proyectosDelServer, mountedRef.current)
            } catch (error) {
                console.log(error);
            }
        }
        const getProyectosPorCategoria = async () => {
            try{
                const proyectosFiltrados = await fetchProyectosPorCategoria(categoria)
                setProyectosCheck(proyectosFiltrados, mountedRef.current)
            } catch (error) {
                console.log(error);
            }
        }
        const getProyectosPasadosPorCategoria = async () => {
            try{
                const proyectosPasados =  await fetchProyectosPasadosPorCategoria(categoria)
                setProyectosCheck(proyectosPasados, mountedRef.current, true)
            } catch (error) {
                console.log(error);
            }
        }
        const getLideres = async ()=>{
            try{
                const lideresDelServer = await fetchLideres()
                mountedRef.current && setLideres(lideresDelServer)
            } catch (error) {
                console.log(error);
            }
        }
        const getCategorias = async () => {
            try{
                const categosServer = await fetchCategorias()
                mountedRef.current && setCategorias(categosServer)
            } catch (error) {
                console.log(error);
            }
        }
        

        categoria? getProyectosPorCategoria() : getProyectos()
        getProyectosPasadosPorCategoria()
        getLideres()
        getCategorias()

        return () => {
            mountedRef.current = false // Desmontar componentes evitando warnings
        }
    }, [actualizar, categoria, /*proyectosPasadosCategoria*/] )

    
    // ==== HTTP REQUESTS & FUNCIONES ====
    // GETs
    async function fetchProyectos() {
        try{
            const response = await fetch(URLProyectos)
            const data = await response.json()
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    const fetchProyectosPorCategoria = async(categoria) => {
        try{
            const response= await fetch(`${URLProyectos}/${categoria}`)
            const data = response && response.status === 204? [] : await response.json(); //FIXME: Evita un warning, pero backend deberia hacer esta validacion del status 204 y no frontend
            return data
            //setProyectos(proyectos.filter((proy) => proy.categoria == categoria));
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchProyectosPasadosPorCategoria(categoria) {
        try{
            const response = await fetch(`${URLProyectosPasados}/${categoria}`)
            const data = await response.json()
            return data;
        } catch (error) {
            console.log(error);
        }
    }
    
    const fetchCategorias = async () => {
        try{
            const response = await fetch(URLCategorias)
            const data = await response.json()
            return data
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchLideres() {
        try{
            const response = await fetch(URLLideres)
            const data = await response.json()
            let dataLider=[]
            let index=1
            for (let x of data ) {
                dataLider.push({"id": index,"nombre":`${x.nombre}`})
                index++
            }
            //dataLider.pop()
            return dataLider;
        } catch (error) {
            console.log(error);
        }
    }

    const obtenerParticipacionProyecto = async (idProyecto) => {
        try{
            const idSesion = sessionStorage.getItem("id");
            const response = await fetch(`${URLParticpaVoluntario}/${idProyecto}/sesion/${idSesion}`,
            { 
                method: 'GET'
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    const obtenerNumeroParticipantes = async (idProyecto) => {
        try{
            const response = await fetch(`${URLNumeroParticipantes}/${idProyecto}`,
            { 
                method: 'GET'
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    }

    /*async function fetchProyectosPasados() {
        const response = await fetch(URLProyectosPasados)
        const data = await response.json()
        return data;
    }*/
    
    // CREATEs
    const crearProyecto = async (nuevoProyecto) => {
        try{
            const response = await fetch(
                URLCrearProy,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify(nuevoProyecto)
                })
            const data = await response.json()
            setProyectos([...proyectos, data])
            setActualizar(!actualizar) //Para activar useEffect sin causar loop infinito
        } catch (error) {
            console.log(error);
        }
    }
    
    // UPDATEs
    const editarProyecto = async (proyectoEditar) => {
        try{
            //const response = 
            await fetch(
                `${URLEditarProy}/${proyectoEditar.id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json'},
                    body: JSON.stringify(proyectoEditar)
                })
            //const data = await response.json()
            //setProyectos([...proyectos.filter((proy) => proy.id !== proyectoEditar.id), data]) actualizar proyecto manualmente
            setActualizar(!actualizar) //Para activar useEffect sin causar loop infinito
        } catch (error) {
            console.log(error);
        }
    }

    const participarEnProyecto = async (id) => { 
        const idSesion = sessionStorage.getItem("id");
        try{
            const response = await fetch(
            `${URLParticiparProy}/${id}/sesion/${idSesion}`,
            { 
                method: 'PUT'
            })
            const data = await response.json()
            //setActualizar(!actualizar)
            return data
        } catch (error) {
            console.log(error);
        }
    }
    
    // DELETEs
    const cancelarParticipacionProyecto = async (id) => { 
        const idSesion = sessionStorage.getItem("id");
        try{
            const response = await fetch(
                `${URLCancelarParticipProy}/${id}/sesion/${idSesion}`,
                { 
                    method: 'DELETE'
                })
            const data = await response.json()
            //setActualizar(!actualizar)
            return data
        } catch (error) {
            console.log(error);
        }
    }

    const eliminarProyecto = async (id) => { 
        try{
            await fetch(
            `${URLEliminarProy}/${id}`,
            { 
                method: 'DELETE'
            })
        
            setProyectos(proyectos.filter((proy) => proy.id !== id));
        } catch (error) {
            console.log(error);
        }
    }

    // ==== COMPONENTES: ====
    let proyectosAdmins = <ProyectosAdmins rol={"core team"}
                                proyectos={proyectos}
                                lideres={lideres} 
                                categorias={categorias}
                                onCrearProy={crearProyecto} 
                                onEliminarProy={eliminarProyecto} 
                                onPartiparProy={participarEnProyecto} 
                                onEditarProy={editarProyecto} 
                                onGetParticipacion={obtenerParticipacionProyecto}
                                onCancelarParticipacion={cancelarParticipacionProyecto}
                                onNumeroParticipantes={obtenerNumeroParticipantes}
                                tituloHeader={complementoHeader}
                                proyectosPasadosCategoria={proyectosPasadosCategoria}/> 
    let proyectosVoluntarios = <ProyectosVoluntarios rol={"core team"}
                                    proyectos={proyectos}
                                    onPartiparProy={participarEnProyecto}
                                    onGetParticipacion={obtenerParticipacionProyecto}
                                    onCancelarParticipacion={cancelarParticipacionProyecto}
                                    onNumeroParticipantes={obtenerNumeroParticipantes}
                                    tituloHeader={complementoHeader}
                                    proyectosPasadosCategoria={proyectosPasadosCategoria}/>
    
    // ==== RENDER ====
    return (
        <>
            <PuertaPermisos scopes={[SCOPES.canCrudProyectos]}>
                {proyectosAdmins}
            </PuertaPermisos>
            
            <PuertaPermisos scopes={[SCOPES.canNotCrudProyectos]}>
                {proyectosVoluntarios}
            </PuertaPermisos>
        </>
    );
}

const url = process.env.REACT_APP_API;
const URLLideres = `${url}get_lideres`
const URLParticiparProy = `${url}participate_proyecto`//`http://localhost:5000/participate_proyecto`
const URLProyectos = `${url}get_proyectos`//'http://localhost:5000/get_proyectos'
const URLCrearProy = `${url}create_proyecto`//'http://localhost:5000/create_proyecto'//
const URLEditarProy = `${url}update_proyecto`//'http://localhost:5000/update_proyecto'//
const URLEliminarProy = `${url}delete_proyecto`//'http://localhost:5000/delete_proyecto'//
const URLParticpaVoluntario = `${url}participate`//'http://localhost:5000/participate'//
const URLCancelarParticipProy = `${url}cancel_participate_proyecto`//http://localhost:5000/cancel_participate_proyecto/37/sesion/24
const URLNumeroParticipantes = `${url}get_numero_participantes` //'http://localhost:5000/get_rol/'
const URLProyectosPasados = `${url}get_proyectos_acabado`
const URLCategorias = `${url}get_categoria_proyectos`//``http://localhost:5000/get_categorias`//`
export default VistaProyectos;