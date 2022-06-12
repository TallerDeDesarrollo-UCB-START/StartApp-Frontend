import React, { useState, useEffect} from "react";
import { MenuItem, Typography } from "@material-ui/core";
import {
	getLeaders,
	getCategories,
	getProjects,
	createEvent
} from "../../../api/rename/renameAPI";
import MyButton from "../../../components/button";
import MySelect from "../../../components/select";
import MyTextField from "../../../components/textField";
import MyTimePicker from "../../../components/timePicker/TimePicker";
import MyDatePicker from "../../../components/datePicker/DatePicker";

const EventForm = () => {
	const [leaders, setLeaders] = useState([]);
	const [categories, setCategories] = useState([]);
	const [projects, setProjects] = useState([]);

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [leader, setLeader] = useState("");
	const [mode, setMode] = useState("");
	const [location, setLocation] = useState("");
	const [category, setCategory] = useState("");
	const [project, setProject] = useState("");
	const [date, setDate] = useState(null);
	const [startTime, setStartTime] = useState(null);
	const [endTime, setEndTime] = useState(null);

	useEffect(() => {
		callGetLeaders();
		callGetCategories();
		callGetProjects();
	}, []);

	const callGetLeaders = async () => {
		const response = await getLeaders();
		const leaderNames = response.data.map((leader) => leader.nombre + " " + leader.apellido);
		leaderNames.unshift("Sin Asignar");
		setLeaders(leaderNames);
	}

	const callGetCategories = async () => {
		const response = await getCategories();
		const categoryNames = response.data.map((category) => category.interes);
		setCategories(categoryNames);
	}

	const callGetProjects = async () => {
		const response = await getProjects();
		const projectNames = response.data.map((project) => project.titulo);
		projectNames.unshift("No Seleccionado");
		setProjects(projectNames);
	}

	function prepareCreateEventDTO() {
		return {
      nombre_evento: name,
      descripcion_evento: description,
      lider: leader,
      modalidad_evento: mode,
      lugar_evento: location,
      categoria: category,
      proyecto: "Ninguno",
      fecha_evento: date.toString(),
      hora_inicio: startTime.toString(),
      hora_fin: endTime.toString(),
      estado: "1",
    }
	}

	async function handleCreateEvent() {
		const eventDTO = prepareCreateEventDTO();
		const response = await createEvent(eventDTO);
		window.location.reload();
	}

  return (
		<>
			<Typography variant="h6" component="h2">
				Crear evento
			</Typography>
			<MyTextField
				label="Nombre del evento *"
				value={name}
				onChange={({ target }) => setName(target.value)}
			/>
			<MyTextField
				label="Descripción"
				value={description}
				onChange={({ target }) => setDescription(target.value)}
				multilineRows={4}
			/>
			<MySelect
				placeholder="Líder *"
				value={leader}
				onChange={({ target }) => setLeader(target.value)}
			>
				{leaders.map((item) => (
					<MenuItem key={item} value={item}>
						{item}
					</MenuItem>
				))}
			</MySelect>
			<MySelect
				placeholder="Modalidad *"
				value={mode}
				onChange={({ target }) => setMode(target.value)}
			>
				<MenuItem value="Presencial">
					Presencial
				</MenuItem>
				<MenuItem value="Virtual">
					Virtual
				</MenuItem>
			</MySelect>
			<MyTextField
				label="Lugar"
				value={location}
				onChange={({ target }) => setLocation(target.value)}
			/>
			<MySelect
				placeholder="Categoría *"
				value={category}
				onChange={({ target }) => setCategory(target.value)}
			>
				{categories.map((item) => (
					<MenuItem key={item} value={item}>
						{item}
					</MenuItem>
				))}
			</MySelect>
			<MySelect
				placeholder="Proyecto"
				value={project}
				onChange={({ target }) => setProject(target.value)}
			>
				{projects.map((item) => {
					return (
						<MenuItem key={item} value={item}>
							{item}
						</MenuItem>
					);
				})}
			</MySelect>
			<MyDatePicker
				label="Fecha *"
				value={date}
				onChange={(value) => setDate(value)}
			/>
			<MyTimePicker 
				label="Hora Inicio *"
				value={startTime}
				onChange={(value) => setStartTime(value)}
			/> 
			<MyTimePicker
				label="Hora Fin *"
				value={endTime}
				onChange={(value) => setEndTime(value)}
			/>

			<MyButton
				className="default"
				onClick={async () => handleCreateEvent()}
			>
				Crear evento
			</MyButton>
		</>
	);
}

export default EventForm;