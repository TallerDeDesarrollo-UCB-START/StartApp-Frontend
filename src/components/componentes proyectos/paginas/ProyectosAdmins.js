// Componentes:
import HeaderProyectosAdmin from '../organismos/HeaderProyectosAdmin'
import BodyProyectos from '../organismos/BodyProyectos'
import FormularioCrearProyecto from '../moleculas/FormularioCrearProyecto'
import FormularioEditarProyecto from '../moleculas/FormularioEditarProyecto'
// Librerias-Paquetes:
import {useState} from 'react'
import { Box } from '@material-ui/core';


function ProyectosAdmins({proyectos, onCrearProy, onEliminarProy, onEditarProy, obtenerProyecto}) {
    // Hooks
    const [mostrarFormCrear, setMostrarFormCrear] = useState(false)
    const [mostrarFormEditar, setMostrarFormEditar] = useState(false)

    // Funciones
    const activarFormCrear = () => {
        setMostrarFormCrear(!mostrarFormCrear);
    }

    const activarFormEditar = () => {
        console.log('Hola')
        setMostrarFormEditar(!mostrarFormEditar);
    }

    //Componentes
    const FormularioCrear = mostrarFormCrear==true ? <FormularioCrearProyecto onCrearProy={onCrearProy} onActivarForm={activarFormCrear}/> : <></>
    const FormularioEditar = mostrarFormEditar==true ? <FormularioEditarProyecto onEditarProy={onEditarProy} onActivarForm={activarFormEditar} proyecto={proyecto}/> : <></>

    return (
        <Box style={styles}>
            <HeaderProyectosAdmin onActivarForm={activarFormCrear}/>
            {FormularioCrear}
            {FormularioEditar}
            <BodyProyectos proyectos={proyectos} 
                            onEliminarProy={onEliminarProy} 
                            onActivarForm={activarFormEditar}
                            obtenerProyecto={obtenerProyecto}/>
        </Box>
    );
}

const styles= {
    minHeight: "650px"
    //border: "4px solid orange"
}

export default ProyectosAdmins