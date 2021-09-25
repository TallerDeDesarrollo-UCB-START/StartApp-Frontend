// Componentes:
import HeaderProyectosAdmin from '../organismos/HeaderProyectosAdmin'
import BodyProyectos from '../organismos/BodyProyectos'
import FormularioCrearProyecto from '../moleculas/FormularioCrearProyecto'
// Librerias-Paquetes:
import {useState} from 'react'
import { Box } from '@material-ui/core';


function ProyectosAdmins({proyectos, onCrearProy}) {
    // Hooks
    const [mostrarFormCrear, setMostrarFormCrear] = useState(false)

    // Funciones
    const activarFormCrear = () => {
        console.log('Hola')
        setMostrarFormCrear(!mostrarFormCrear);
    }

    //Componentes
    const FormularioCrear = mostrarFormCrear==true ? <FormularioCrearProyecto onCrearProy={onCrearProy} onActivarForm={activarFormCrear}/> : <></>

    return (
        <Box style={styles}>
            <HeaderProyectosAdmin onActivarForm={activarFormCrear}/>
            {FormularioCrear}
            <BodyProyectos proyectos={proyectos}/>
        </Box>
    );
}

const styles= {
    minHeight: "650px"
    //border: "4px solid orange"
}

export default ProyectosAdmins