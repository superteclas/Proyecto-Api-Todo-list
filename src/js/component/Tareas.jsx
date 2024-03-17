import React, { useState, useEffect } from 'react';

function Tareas() {
    const [lista, setLista] = useState([]);
    const [inputTarea, setInputTarea] = useState('');
    const [usuarioCreado, setUsuarioCreado] = useState(false);
    const [contadorId, setContadorId] = useState(0); // Contador para las tareas

    useEffect(() => {
        if (!usuarioCreado) {
            createUser();
        } else {
            getInfo();
        }
    }, [usuarioCreado]);

    const manejarEnvioFormulario = (event) => {
        event.preventDefault();
        console.log("Creando tarea con título: ", inputTarea);

        // nueva tarea a la lista y actualizarla
        const nuevaTarea = { id: contadorId, label: inputTarea, done: false }; // Asignar un ID único a cada tarea
        const listaActualizada = [...lista, nuevaTarea];
        setLista(listaActualizada);
        setContadorId(contadorId + 1); // Contador//

        // Lista actualizada
        actualizarListaEnServidor(listaActualizada);
        
        setInputTarea('');
    };

    const borrarTarea = (taskId) => {
        const listaActualizada = lista.filter((tarea) => tarea.id !== taskId);
        setLista(listaActualizada);
        
        // Actualizar la lista en el servidor
        actualizarListaEnServidor(listaActualizada);
    };

    const actualizarListaEnServidor = (listaActualizada) => {
        fetch("https://playground.4geeks.com/apis/fake/todos/user/<superteclas>", {
            method: "PUT",
            body: JSON.stringify(listaActualizada),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.log(error));
    };
//crear usuario//
    function createUser() {
        fetch("https://playground.4geeks.com/apis/fake/todos/user/<superteclas>", {
            method: "POST",
            body: JSON.stringify([]),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((response) => response.json())
        .then((data) => {
            setUsuarioCreado(true);
            console.log(data);
        })
        .catch((error) => console.log(error));
    }
//tomar info//
    function getInfo() {
        fetch("https://playground.4geeks.com/apis/fake/todos/user/<superteclas>", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((response) => response.json())
        .then((data) => {
            setLista(data);
        })
        .catch((error) => console.log(error));
    }

    const tareasParaRenderizar = lista.map((tarea, index) => (
        <li key={index}>
            <div className="view">
                <label>{tarea.label}</label>
                <button className="destroy" onClick={() => borrarTarea(tarea.id)}></button>
            </div>
        </li>
    ));

    return (
        <section className="todoapp">
            <header className="header">
                <h1>Lista de tareas pendientes</h1>
                <form onSubmit={manejarEnvioFormulario}>
                    <input
                        autoFocus={true}
                        className="new-lista"
                        placeholder="¿Qué necesitas hacer?"
                        value={inputTarea}
                        onChange={(evt) => setInputTarea(evt.target.value)}
                    />
                </form>
            </header>
            <section className="main">
                <ul className="todo-list">
                    {tareasParaRenderizar}
                </ul>
            </section>
            <footer className="footer">
                <span className="todo-count">
                    <strong>{lista.filter((tarea) => !tarea.done).length}</strong> tareas por hacer
                </span>
            </footer>
        </section>
    );
}

export default Tareas;

