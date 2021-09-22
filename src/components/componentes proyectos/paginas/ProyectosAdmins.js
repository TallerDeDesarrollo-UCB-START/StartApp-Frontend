// Componentes:
import HeaderProyectosAdmin from '../organismos/HeaderProyectosAdmin'
import BodyProyectos from '../organismos/BodyProyectos'
// Librerias-Paquetes:
import { Box } from '@material-ui/core';
import {useState, useEffect} from 'react'


function ProyectosAdmins() {
    // Hooks
    const [proyectos, setProyectos] = useState([])

    useEffect(() => {
        const getProyectos = async () => {
        const proyectosDelServer =  await fetchProyectos()
        setProyectos(proyectosDelServer)
        }
        getProyectos()
    }, [] )

    // HTTP requests & functions
    async function fetchProyectos() {
        const response = await fetch(URLProyectos)
        const data = await response.json()
        return data;
    }
    
    return (
        <Box style={styles}>
            <HeaderProyectosAdmin />
            <BodyProyectos proyectos={proyectos}/>
        </Box>
    );
}

const url = process.env.REACT_APP_API
const URLProyectos = `${url}get_proyectos`

const styles= {
    minHeight: "650px",
    border: "4px solid orange"
}

export default ProyectosAdmins