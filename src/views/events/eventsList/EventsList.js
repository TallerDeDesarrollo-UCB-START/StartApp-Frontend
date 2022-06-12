import React, { Component } from "react";
import axios from "axios";
import { Modal } from "reactstrap";
import "./EventsList.css";
import TextField from "@mui/material/TextField";
import { MenuItem, Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import Typography from "@material-ui/core/Typography";
import RedirectErrorPage from "../../../components/redirect status/RedirectErrorPage";
import { useHistory } from "react-router-dom";
import MyButton from "../../../components/button";
import MySelect from "../../../components/select";
import MyInputText from "../../../components/inputText";
import EventCard from "../../../components/eventCard"

const url = process.env.REACT_APP_API;
const urlDeploy = `${url}eventos`;
const urlCrearEvento = `${url}eventos/crearevento`;
const urlLideres = `${url}lideres`;
const urlProyectos = `${url}get_proyectos`;
const MAX_CHAR_SIZE = 200
const apiLideres = axios.create({
  baseURL: urlLideres,
});

const apiProyectos = axios.create({
  baseURL: urlProyectos,
});

const current = new Date();
let history = null

//const currentDate = `${current.getFullYear()}-${current.getMonth() + 1}-${("0" + current.getDate()).slice(-2)}`;
const currentDate = `${current.getFullYear()}-${(
  "0" + parseInt(current.getMonth() + 1)
).slice(-2)}-${("0" + current.getDate()).slice(-2)}`;

const api = axios.create({
  baseURL: urlDeploy,
});
const urlParticipacion = `${urlDeploy}/participate_evento/`;
class EventsListClass extends Component {
  state = {
    events: [],
    participaciones: [],
    user: "",
    divcontainer: true,
    container: false,
    abierto: false,
    botonMostrar: false,
    botonArchivar: true,
    botonMostrarEventosNoArchivados: false,
    botonMostrarEventosArchivados: true,
    success: false,
    categoriaFiltrada: "Todas",
    categorias: [],

    modalInsertar: false,
    form: {
      nombre_evento: "",
      descripcion_evento: "",
      lider: "Sin Asignar",
      modalidad_evento: "Presencial",
      lugar_evento: "",
      fecha_evento: "",
      categoria: "Todas",
      estado: "1",
      hora_inicio: "",
      hora_fin: "",
      proyecto: "Ninguno",
    },
    lideres: [],
    proyectos: [],
    snackbarAbierto: false,
    mensajeSnackbar: "",
    severidadSnackbar: "",
  };

  constructor() {
    super(); 
    this.getEvents();
    this.getParticipaciones();
    this.getCategorias();
    this.getUserRol();
    this.getLideres();
    this.getProyectos();
    this.active = false;
    this.selectedEvent = {};

  }
  
  abrirModal = () => {
    this.setState({ abierto: !this.state.abierto });
  };
  getCategorias = async () => {
    try{
      let data = await api.get("/categorias").then(({ data }) => data);
      let aux = data.map((item) => {
        return item.interes;
      });
      aux.unshift("Todas");
      this.setState({ categoriaFiltrada: aux[0] });
      this.setState({ categorias: aux });
    } catch (error) {
      if (error.message == "Network Error"){
        RedirectErrorPage(500,history,"Hubo un error en la conexión con los datos.");
        return;
      }
      console.log(error);
      throw error;
    }
  };

  getEvents = async () => {
    try {
      let data = await api.get("/").then(({ data }) => data);
      if (this.state.categoriaFiltrada !== "Todas") {
        data = data.filter(
          (event) =>
            (event.fecha_evento === currentDate ||
              event.fecha_evento > currentDate) &&
            event.categoria === this.state.categoriaFiltrada
        );
        this.setState({ container: true });
      } else {
        data = data.filter(
          (event) =>
            event.fecha_evento === currentDate ||
            event.fecha_evento > currentDate
        );
        this.setState({ container: true });
      }

      this.setState({ events: data });
      return true;
    } catch (error) {
      if (error.message == "Network Error"){
        RedirectErrorPage(500,history,"Hubo un error en la conexión con los datos.");
        return;
      }
      console.log(error);
      throw error;
    }
  };
  getCategorias = async () => {
    try{
      let data = await api.get("/categorias").then(({ data }) => data);
      let aux = data.map((item) => {
        return item.interes;
      });
      aux.unshift("Todas");
      this.setState({ categoriaFiltrada: aux[0] });
      this.setState({ categorias: aux });
    } catch (error) {
      if (error.message == "Network Error"){
        RedirectErrorPage(500,history,"Hubo un error en la conexión con los datos.");
        return;
      }
      console.log(error);
      throw error;
    }
  };

  getEventsArchivados = async () => {
    try {
      this.state.botonMostrar = true;
      this.state.botonArchivar = false;
      this.state.botonMostrarEventosNoArchivados = true;
      this.state.botonMostrarEventosArchivados = false;
      let data = await api.get("/").then(({ data }) => data);
      if (this.state.categoriaFiltrada !== "Todas") {
        data = data.filter(
          (event) =>
            event.fecha_evento < currentDate &&
            event.categoria === this.state.categoriaFiltrada
        );
        this.setState({ container: true });
      } else {
        data = data.filter((event) => event.fecha_evento < currentDate);
        this.setState({ container: true });
      }
      if (data == null) {
        this.setState({ container: true });
      }
      this.setState({ events: data });
    } catch (error) {
      if (error.message == "Network Error"){
        RedirectErrorPage(500,history,"Hubo un error en la conexión con los datos.");
        return;
      }
      console.log(error);
      throw error;
    }
  };

  deleteEvento = async (event) => {
      await axios.delete(urlDeploy + "/" + event.id)
      .catch((error) => {
        if (error.message == "Network Error"){
          RedirectErrorPage(500,history,"Hubo un error en la conexión con los datos.");
          return;
        }
        console.log(error);
        throw error;
      });
      this.getEvents();
      this.abrirModal();
  };

  //Peticiones pertenecientes a Archivar y Motrar
  peticionArchivar = async (event) => {
      await axios.put(urlDeploy + "/archivar_evento/" + event.id)
      .catch((error) => {
        if (error.message == "Network Error"){
          RedirectErrorPage(500,history,"Hubo un error en la conexión con los datos.");
          return;
        }
        console.log(error);
        throw error;
      });
      this.getEventsArchivados();
      window.location.reload();
  };

  peticionMostrar = async (event) => {
    this.state.botonMostrar = false;
    this.state.botonArchivar = true;
    this.state.botonMostrarEventosNoArchivados = false;
    this.state.botonMostrarEventosArchivados = true;
    await axios.put(urlDeploy + "/mostrar_evento/" + event.id)
    .catch((error) => {
      if (error.message == "Network Error"){
        RedirectErrorPage(500,history,"Hubo un error en la conexión con los datos.");
        return;
      }
      console.log(error.message);
      throw error;
    });
    this.getEvents();
  };
  sleep = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  //Funciones pertenecientes a obtener Participacion
  postParticipacion = async (event) => {
    let newUrl =
      urlParticipacion + event.id + "/sesion/" + window.sessionStorage.id;
    return await axios
      .post(newUrl, {
        id: event.id,
        id_autenticacion: window.sessionStorage.id,
      })
      .then(async (response) => {
        this.mostrarMensajeSnackbar(event);
        await this.mensajeConfirmacionParticipacion(event);
      })
      .catch((error) => {
        if (error.message == "Network Error"){
          RedirectErrorPage(500,history,"Hubo un error en la conexión con los datos.");
          return;
        }
        console.log(error.message);
        throw error;
      });
  };

  getParticipaciones = async () => {
    try {
      var data = await api
        .get(`/participante/${window.sessionStorage.id}`)
        .then(({ data }) => data);
      this.setState({ participaciones: data });
    } catch (error) {
      if (error.message == "Network Error"){
        RedirectErrorPage(500,history,"Hubo un error en la conexión con los datos.");
        return;
      }
      console.log(error);
      throw error;
    }
  };

  filterChangeHandler = (categoria) => {
    this.setState({ categoriaFiltrada: categoria.target.value });
    this.getEvents();
  };
  filterPastEventsChangeHandler = (categoria) => {
    this.setState({ categoriaFiltrada: categoria.target.value });
    this.getEventsArchivados();
  };
  mensajeConfirmacionParticipacion = async (event) => {
    this.handleClick(); //abre el snackbar
    await this.sleep(2000);
    window.location.reload();
  };

  //Funciones pertenecientes a Eliminacion Participacion
  eliminarParticipacion = async (event) => {
    await axios
      .delete(
        urlDeploy +
          "/eliminar_participacion/" +
          event.id +
          "/" +
          window.sessionStorage.id
      )
      .then((response) => {
        this.mostrarMensajeSnackbar(event);
        this.mensajeConfirmacionEliminacionParticipacion(event);
      })
      .catch((error) => {
        if (error.message == "Network Error"){
          RedirectErrorPage(500,history,"Hubo un error en la conexión con los datos.");
          return;
        }
        console.log(error.message);
        throw error;
      });
  };

  mensajeConfirmacionEliminacionParticipacion = async (event) => {
    this.handleClick(); //abre el snackbar
    await this.sleep(2000);
    window.location.reload();
  };

  //Mostrar y Ocultar botones participacion
  validarBotones(event) {
    return !this.state.participaciones.some(function (evento) {
      return evento.id_evento === event.id;
    });
  }

  mostrarMensajeSnackbar = (event) => {
    if (this.validarBotones(event)) {
      this.setState({
        mensajeSnackbar: "Tu participación en el evento ha sido registrada",
        severidadSnackbar: "success",
      });
    } else {
      this.setState({
        mensajeSnackbar: "Tu participación en el evento ha sido eliminada",
        severidadSnackbar: "success",
      });
    }
  };

  getUserRol = async () => {
    try {
      let data = await axios.get(
        url + "extended_form/" + window.sessionStorage.id
      ).catch((error) =>
      {
        console.log(error);
        throw error;
      });
      let rol = await data.data.data.rol;
      this.setState({ user: rol });
    } catch (error) {
      if (error.message == "Network Error"){
        RedirectErrorPage(500,history,"Hubo un error en la conexión con los datos.");
        return;
      }
      console.log(error);
      throw error;
    }
  };

  //Funciones Crear Evento

  mostrarModalInsertar() {
    this.setState({
      modalInsertar: true,
    });
  }

  peticionPost = async () => {

    let errors = ""
    if (this.state.form.nombre_evento.length > MAX_CHAR_SIZE)
      errors = " Nombre del evento "
    if (this.state.form.descripcion_evento.length > MAX_CHAR_SIZE)
      errors = errors + ((errors!="")?",":"") +" Descripcion "
    if (this.state.form.lugar_evento.length > MAX_CHAR_SIZE)
      errors = errors + ((errors!="")?",":"") + " Lugar "
    if (errors != ""){
      this.handleClick();
      this.setState({
        mensajeSnackbar: `El maximo de caracteres es ${MAX_CHAR_SIZE} para los campos: ${errors}`,
        severidadSnackbar: `error`,
      });
      return false
    }
    if (this.state.form.nombre_evento && this.state.form.fecha_evento) {
      if (this.state.form.nombre_evento.trim().length > 0) {
        await axios
          .post(urlCrearEvento, this.state.form)
          .then((response) => {
            this.insertar();
          })
          .catch((error) => {
            if (error.message == "Network Error"){
              RedirectErrorPage(500,history,"Hubo un error en la conexión con los datos.");
              return;
            }
            console.log(error.message);
            throw error;
          });
      } else {
        this.handleClick();
        this.setState({
          mensajeSnackbar: "El nombre del evento debe tener entre 1 y 100 caracteres.",
          severidadSnackbar: "error",
        });
        return false
      }
    } else {
      this.handleClick();
      this.setState({
        mensajeSnackbar: "Llenar todos los campos obligatorios",
        severidadSnackbar: "error",
      });
      return false
    }
    return true
  };

  getLideres = async () => {
    try {
      let data = await apiLideres.get("/").then(({ data }) => data);
      let aux = data.map((item) => {
        return item.nombre + " " + item.apellido;
      });
      aux.unshift("Sin Asignar");
      let result = aux.filter((item, index) => {
        return aux.indexOf(item) === index;
      });
      this.setState({ lideres: result });
    } catch (error) {
      if (error.message == "Network Error"){
        RedirectErrorPage(500,history,"Hubo un error en la conexión con los datos.");
        return;
      }
      console.log(error);
      throw error;
    }
  };

  getProyectos = async () => {
    try {
      let data = await apiProyectos.get("/").then(({ data }) => data);
      let aux = data.map((item) => {
        return item.titulo;
      });
      aux.unshift("No Seleccionado");
      let result = aux.filter((item, index) => {
        return aux.indexOf(item) === index;
      });
      this.setState({ proyectos: result });
    } catch (error) {
      if (error.message == "Network Error"){
        RedirectErrorPage(500,history,"Hubo un error en la conexión con los datos.");
        return;
      }
      console.log(error);
      throw error;
    }
  };

  cerrarModalInsertar() {
    this.setState({ modalInsertar: false });
  }

  insertar = async () => {
    this.handleClick();
    this.setState({
      mensajeSnackbar: "Evento Guardado",
      severidadSnackbar: "success",
    });
    await this.sleep(2000);
    this.cerrarModalInsertar();
    window.location.reload();
  };

  handleChange = (e) => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
  };
  // handleOpen = () => this.setState({ snackbarAbierto: true });
  handleClose = () => this.setState({ snackbarAbierto: false });
  handleClick = () => this.setState({ snackbarAbierto: true });

  render() {
    const modalStyles = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
    };
    const rolUser = this.state.user;
    const { snackbarAbierto } = this.state;
    try{
      return (
        <>
        <MyButton
          onClick={() => window.history.back()}
          className="go-back"
        />
        <Typography variant="h2" component="h2">
          {this.state.botonMostrarEventosArchivados ? "EVENTOS VIGENTES" : "EVENTOS PASADOS"}
        </Typography>
          <div>
            <div>
              <MySelect
                placeholder="Categoría"
                value={this.state.categoriaFiltrada}
                onChange={this.state.botonMostrarEventosArchivados ? this.filterChangeHandler : this.filterPastEventsChangeHandler}
              >
                {this.state.categorias.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </MySelect>
              <MyButton className="filter" variant={"outlined"} onClick={() => this.getEvents()}>
                EVENTOS VIGENTES
              </MyButton>
              <MyButton className="filter" variant={"outlined"} onClick={() => this.getEventsArchivados()}>
                EVENTOS PASADOS
              </MyButton>
            </div>

            <div>
              {rolUser !== "voluntario" && (
                <MyButton onClick={() => this.mostrarModalInsertar()} className="default">
                  CREAR EVENTO
                </MyButton>
              )}
            </div>
          </div>

            <div className="Container-Body">
              {this.state.events.map((event) => (
                <EventCard event={event} hasActions={true}/>
              ))}
            </div>

          <div>
            <Snackbar
              anchorOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              open={snackbarAbierto}
              onClose={this.handleClose}
              autoHideDuration={3000}
            >
              <MuiAlert
                onClose={this.handleClose}
                severity={this.state.severidadSnackbar}
                elevation={6}
                variant="filled"
              >
                {this.state.mensajeSnackbar}
              </MuiAlert>
            </Snackbar>
          </div>

          <Modal id="ModalFormCrearEvento" isOpen={this.state.modalInsertar}>
            <div className="Titulo">
              <strong>Crear Evento</strong>
            </div>

            <form className="FormularioCrearEvento">
            <MyInputText
              label="Nombre del evento *"
              className="nombreEventoCrear textInput"
              name="nombre_evento"
              onChange={this.handleChange}
            />
              

              <br></br>

              <TextField
                id="filled-multiline-flexible"
                multiline
                maxRows={4}
                label="Descripción"
                placeholder="Descripcion"
                className="descripcionEventoCrear textInput"
                name="descripcion_evento"
                type="text"
                onChange={this.handleChange}
              />

              <MySelect
                placeholder="Líder *"
                name="lider"
                onChange={this.handleChange}
              >
                {this.state.lideres.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </MySelect>

              <br />

              <MySelect
                placeholder="Modalidad *"
                name="modalidad_evento"
                onChange={this.handleChange}
              >
                <MenuItem value="Presencial" name="modalidad_evento">
                  Presencial
                </MenuItem>
                <MenuItem value="Virtual" name="modalidad_evento">
                  Virtual
                </MenuItem>
              </MySelect>
          
              <MyInputText
                label="Lugar"
                className="LugarEventoCrear textInput"
                name="lugar_evento"
                onChange={this.handleChange}
              />

              <TextField
                label="Fecha *"
                placeholder="Fecha *"
                className="FechaEventoCrear textInput"
                name="fecha_evento"
                type="date"
                onChange={this.handleChange}
              />

              <MySelect
                placeholder="Categoría *"
                name="categoria"
                onChange={this.handleChange}
              >
                {this.state.categorias.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </MySelect>

              <br />

              <MySelect
                placeholder="Proyecto"
                name="proyecto"
                onChange={this.handleChange}
              >
                {this.state.proyectos.map((item) => {
                  return (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  );
                })}
              </MySelect>

              <TextField 
                label="Hora Inicio *"
                placeholder="Hora Inicio *"
                className="HoraInicioEventoCrear textInput" 
                name="hora_inicio"
                type="time"
                onChange={this.handleChange}
              /> 

              <TextField
                label="Hora Fin *"
                placeholder="Hora Fin *"
                className="HoraFinEventoCreae textInput"
                name="hora_fin"
                type="time"
                onChange={this.handleChange}
              />

              <div className="CamposBotones">
                <MyButton className="cancel" onClick={() => this.cerrarModalInsertar()}>
                  Cancelar
                </MyButton>
                <MyButton onClick={async () => await this.peticionPost()} className="default">
                  Guardar Evento{" "}
                </MyButton>
                <Snackbar
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  open={this.snackbarAbierto}
                  onClose={this.handleClose}
                  autoHideDuration={4000}
                >
                  <MuiAlert
                    onClose={this.handleClose}
                    severity={this.state.severidadSnackbar}
                    elevation={6}
                    variant="filled"
                  >
                    {this.state.mensajeSnackbar}
                  </MuiAlert>
                </Snackbar>
              </div>
            </form>
            <Snackbar
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              open={this.snackbarAbierto}
              onClose={this.handleClose}
              autoHideDuration={3000}
            >
              <MuiAlert
                onClose={this.handleClose}
                severity={this.state.severidadSnackbar}
                elevation={6}
                variant="filled"
              >
                {this.state.mensajeSnackbar}
              </MuiAlert>
            </Snackbar>
          </Modal>
        </>
      );
    }catch(error){
      if (error.message == "Network Error"){
        RedirectErrorPage(500,history,"Hubo un error en la conexión con los datos.");
        return;
      }
      console.log(error);
      throw error;
    }
  }
}
const EventsList = ()=>{
  history = useHistory();
  return new EventsListClass();
}
export default EventsList;