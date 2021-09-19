// Componentes:
import ParticiparEnProyectoBtn from '../atomos/ParticiparEnProyectoBtn'
// Librerias-Paquetes:
import { Container } from '@material-ui/core';


function ContenidoProyecto() {
    return (
        <Container>
            {
                // Colocan lo que tengan que colocar...
                // El boton de participacion sera un componente atomico.
            }
            <ParticiparEnProyectoBtn />
        </Container>
    );
}

export default ContenidoProyecto