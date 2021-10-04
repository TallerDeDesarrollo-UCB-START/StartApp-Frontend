// Componentes:
import BannerProyecto from '../moleculas/BannerProyecto'
import ContenidoProyectoNormal from '../moleculas/ContenidoProyectoNormal'
import './ProyectoVoluntario.css';

// Librerias-Paquetes:
import { Box } from '@material-ui/core';

// Victor y Merce
function ProyectoVoluntarioNormal({proyecto,  onPartiparProy}) {
    return (
        <Box className="proyect-container">
            <BannerProyecto />
            <ContenidoProyectoNormal proyecto={proyecto} onPartiparProy={onPartiparProy}/>
        </Box>
    );
}

export default ProyectoVoluntarioNormal