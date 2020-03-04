import React from 'react';
import NavBar from "./NavBar";
import '../App.css';
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";
import {Button, Col, Input, Row, Table} from "reactstrap";
import DayPickerInput from "react-day-picker/DayPickerInput";
import MomentLocaleUtils, {formatDate, parseDate} from "react-day-picker/moment";
import Pagination from 'react-js-pagination';


class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //pagination
            activePage: 1,
            itemPerPage: 5,
            //values form
            input: '',
            dataAux: [],
            habilitado: false,
            id_modificar: 0,
            nombre_tarea: '',
            descripcion_tarea: '',
            listaTarea: [],
            render: true,
            modificar: false,
            fecha_inicio: new Date(),
            fecha_termino: new Date(),
            condicion: '',
            critico: '',
            responsable_tarea: ''

        };

    }

    componentDidMount() {
        this.obtenerTareas();
    }


    //APIS
    obtenerTareas = () => {
        let {tareas} = [];
        axios.get(`${process.env.REACT_APP_API_URL}tareas`)
            .then(res => {
                tareas = res.data.data;
                this.setState({
                    listaTarea: tareas,
                    dataAux: tareas
                });
            }).then(() => {
            // console.log(this.state.listaTarea);
        });
    };

    //handles components
    handleRender() {
        this.vaciarInputs();
        let {render} = this.state;
        this.setState({render: !render});
    };

    handleNombreTarea = (event) => {
        this.setState({nombre_tarea: event.target.value, habilitado: true});
    };

    handleDescripcionTarea = (event) => {
        this.setState({descripcion_tarea: event.target.value, habilitado: true});
    };
    handleCritico = (event) => {
        this.setState({critico: event.target.value, habilitado: true});
    };
    handleCondicion = (event) => {
        this.setState({condicion: event.target.value, habilitado: true});
    };
    onChangeHandlerSearch = event => {
        const {listaTarea, dataAux} = this.state;
        let data = dataAux;
        this.setState({
            input: event.target.value,
            inputLength: event.target.value.length
        });
        var newArray = listaTarea.filter((item) => {
            return Object.keys(item).some((key) => item[key].toString().toLowerCase().includes(event.target.value));
        });
        // console.log(newArray);
        if (event.target.value == "" || event.target.value.length < this.state.inputLength) {
            // console.log("nulo");
            this.setState({
                listaTarea: data
            });
        } else {
            this.setState({
                listaTarea: newArray
            });
        }
    };

    handlePageChange(pageNumber) {
        this.setState({activePage: pageNumber});
    };

    handleResponsableTarea = (event) => {
        this.setState({responsable_tarea: event.target.value, habilitado: true});
    };

    handleFechaInicio = (day) => {
        this.setState({fecha_inicio: day, habilitado: true}, () => {
            // console.log(this.state.fecha_inicio);
        });
    };
    handleFechaTermino = (day) => {
        this.setState({fecha_termino: day, habilitado: true}, () => {
            // console.log(this.state.fecha_termino);
        });
    };
    handleInformacion = (res) => {
        // console.log(res);
        this.setState({
            render: false,
            modificar: true,
            habilitado: false,
            id_modificar: res.id,
            nombre_tarea: res.nombre_tarea,
            descripcion_tarea: res.descripcion_tarea,
            fecha_inicio: res.fecha_inicio,
            fecha_termino: res.fecha_termino,
            condicion: res.condicion,
            responsable_tarea: res.responsable_tarea,
            critico: res.critico

        });
    };

    vaciarInputs() {
        this.setState({
            id_modificar: 0,
            nombre_tarea: '',
            descripcion_tarea: '',
            render: true,
            modificar: false,
            fecha_inicio: new Date(),
            fecha_termino: new Date(),
            condicion: '',
            critico: '',
            responsable_tarea: ''
        });
    }

    //CRUD
    agregarTarea = () => {
        let {habilitado, listaTarea, fecha_inicio, fecha_termino, condicion, critico, responsable_tarea, nombre_tarea, descripcion_tarea} = this.state;
        if (habilitado === true && listaTarea.length > 0 && condicion.length > 0
            && critico.length > 0 && responsable_tarea.length > 0 && nombre_tarea.length > 0
            && descripcion_tarea.length > 0 && descripcion_tarea.length > 0) {
            axios.post(`${process.env.REACT_APP_API_URL}nuevaTarea`, {
                nombre_tarea: nombre_tarea,
                descripcion_tarea: descripcion_tarea,
                fecha_inicio: fecha_inicio,
                fecha_termino: fecha_termino,
                condicion: condicion,
                critico: critico,
                responsable_tarea: responsable_tarea
            }).then(() => {
                Swal.fire(
                    'Se ha agregado exitosamente',
                    '',
                    'success'
                );
                this.obtenerTareas();
            }).then(() => {
                this.setState({render: true});
                this.vaciarInputs();
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Rellene Todos Los Campos!',
            });
        }
    };

    modificarTarea() {
        let {id_modificar, nombre_tarea, descripcion_tarea, fecha_inicio, fecha_termino, condicion, critico, responsable_tarea}
            = this.state;
        // console.log(id_modificar, nombre_tarea, descripcion_tarea, fecha_inicio, fecha_termino);
        axios.put(`${process.env.REACT_APP_API_URL}modificarTarea`, {
            id: id_modificar,
            nombre_tarea: nombre_tarea,
            descripcion_tarea: descripcion_tarea,
            fecha_inicio: fecha_inicio,
            fecha_termino: fecha_termino,
            condicion: condicion,
            critico: critico,
            responsable_tarea: responsable_tarea
        }).then((res) => {
            // console.log(res);
            Swal.fire(
                'Se modifico exitosamente',
                '',
                'success'
            );
            this.obtenerTareas();
        }).then(() => {
            this.setState({
                render: true,
                modificar: false,
            });
            this.vaciarInputs();
        });
    }

    eliminarTarea = () => {
        let {id_modificar} = this.state;
        // console.log(this.state.id_modificar);
        Swal.fire({
            title: 'Esta Seguro?',
            text: `Eliminar  Tarea `,
            type: 'warning',
            showCancelButton: true,
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.value) {
                axios.delete(`${process.env.REACT_APP_API_URL}borrarTarea`, {
                    data: {id: id_modificar}
                })
                    .then((res) => {
                        Swal.fire(
                            'Eliminado!',
                            `Se ha eliminado la tarea`,
                            'success'
                        );
                    }).then(() => this.obtenerTareas())
                    .then(() => this.setState({render: true,}));


            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    'Cancelado',
                    'No se ha eliminado',
                    'error'
                );
            }
        });
    };


    render() {
        let {
            activePage, itemPerPage, listaTarea, habilitado, render, condicion, critico, responsable_tarea, nombre_tarea, descripcion_tarea, modificar
        } = this.state;
        const indexOfLastTodo = activePage * itemPerPage;
        const indexOfFirstTodo = indexOfLastTodo - itemPerPage;
        const tareas = listaTarea.slice(indexOfFirstTodo, indexOfLastTodo);

        return (
            <div>
                <div style={{background: '#f5f5f5'}}>
                    <NavBar/>
                    <div className="contenedor">
                        {render ? <div className="contenedor-formulario">
                            <Row>
                                <Col md={12}>
                                    <Col md={12} style={{display: 'flex'}}>

                                        <Col md={8} className="titulo-contenedor">
                                            <div><span id="styleTitulo"> LISTA DE TAREAS </span></div>
                                        </Col> :

                                        <Col md={4} style={{alignSelf: 'center', textAlign: 'end'}}>

                                            <Button id="style-btn"
                                                    size="sm"
                                                    onClick={() => this.handleRender(2)}
                                            > Agregar
                                            </Button>

                                        </Col>
                                    </Col>
                                </Col>

                                <Col md={4} className="searchStyle">
                                    <Input
                                        type="search"
                                        name="search"
                                        id="exampleSearch"
                                        value={this.state.input}
                                        onChange={this.onChangeHandlerSearch}
                                        placeholder="Buscar"
                                    />
                                </Col>
                                <div className="contenedor-Tabla">
                                    <Table borderless responsive style={{textAlign: 'center'}}>
                                        <thead style={{
                                            color: '#0496a2',
                                            borderBottom: '1px solid #d0d0d0'
                                        }}>
                                        <tr>
                                            <th>Tarea a Realizar</th>
                                            <th>Descripción</th>
                                            <th>Condición</th>
                                            <th>Critico</th>
                                            <th>Responsable</th>
                                            <th>Fecha Inicio</th>
                                            <th>Fecha Termino</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {tareas.map((element, index) => {
                                                return <tr key={index}>
                                                    <td style={{cursor: 'pointer'}}
                                                        onClick={() => this.handleInformacion(element, true)}>{element.nombre_tarea} </td>
                                                    <td style={{cursor: 'pointer', maxWidth: '370px'}}
                                                        onClick={() => this.handleInformacion(element, true)}>{element.descripcion_tarea} </td>
                                                    <td style={{cursor: 'pointer'}}
                                                        onClick={() => this.handleInformacion(element, true)}>{element.condicion} </td>

                                                    {element.critico ? <td style={{cursor: 'pointer', color: 'red'}}
                                                                           onClick={() => this.handleInformacion(element, true)}>
                                                        {element.critico ? 'Critico' : ' No Critico'}
                                                    </td> : <td style={{cursor: 'pointer'}}
                                                                onClick={() => this.handleInformacion(element, true)}>
                                                        {element.critico ? 'Critico' : ' No Critico'}
                                                    </td>}

                                                    <td style={{cursor: 'pointer'}}
                                                        onClick={() => this.handleInformacion(element, true)}>
                                                        {element.responsable_tarea}
                                                    </td>
                                                    <td style={{cursor: 'pointer'}}
                                                        onClick={() => this.handleInformacion(element, true)}>{moment(element.fecha_inicio).format('DD-MM-YYYY')} </td>
                                                    <td style={{cursor: 'pointer'}}
                                                        onClick={() => this.handleInformacion(element, true)}>{moment(element.fecha_termino).format('DD-MM-YYYY')} </td>
                                                </tr>;
                                            }
                                        )}

                                        </tbody>
                                    </Table>
                                </div>
                            </Row>
                            <Col md={12}>
                                <div id="pagin">
                                    <Pagination
                                        activePage={this.state.activePage}
                                        itemsCountPerPage={this.state.itemPerPage}
                                        totalItemsCount={this.state.listaTarea.length}
                                        pageRangeDisplayed={2}
                                        onChange={this.handlePageChange.bind(this)}
                                    />
                                </div>
                            </Col>
                        </div> : <div className="contenedor-formulario">
                            <Row>
                                <Col md={12} style={{display: 'flex'}}>
                                    {render === false && modificar === false ?
                                        <Col md={8} className="titulo-contenedor">
                                            <div><span id="styleTitulo"> AGREGAR TAREA </span></div>
                                        </Col> : <Col md={8} className="titulo-contenedor">
                                            <span id="styleTitulo"> MODIFICAR TAREA </span>
                                        </Col>
                                    }
                                    <Col md={4} style={{alignSelf: 'center', textAlign: 'end'}}>
                                        <Button id="style-btn"
                                                size="sm"
                                                onClick={() => this.handleRender(1)}
                                        > Volver </Button>

                                    </Col>
                                </Col>
                                <Col md={12} className="row">
                                    <Col md={2}>
                                        <div id="labelART">
                                            <span>TAREA</span>
                                        </div>
                                        <Input type="text"
                                               className="inputForm"
                                               value={nombre_tarea}
                                               onChange={this.handleNombreTarea}>
                                        </Input>

                                    </Col>
                                    <Col md={4}>
                                        <div id="labelART">
                                            <span>DESCRIPCIÓN TAREA</span>
                                        </div>
                                        <Input type="text"
                                               id="inputForm"
                                               value={descripcion_tarea}
                                               onChange={this.handleDescripcionTarea}>


                                        </Input>

                                    </Col>
                                    <Col md={2} style={{textAlignLast: 'center'}}>
                                        <div id="labelART">
                                            <span style={{width: '100%'}}>FECHA INICIO</span>
                                        </div>
                                        <DayPickerInput onDayChange={this.handleFechaInicio}
                                                        formatDate={formatDate}
                                                        parseDate={parseDate}
                                                        format="DD/MM/YYYY"
                                                        placeholder={`${formatDate(new Date(), 'DD/MM/YYYY', 'es')}`}
                                                        dayPickerProps={{
                                                            locale: 'es',
                                                            localeUtils: MomentLocaleUtils,
                                                        }}
                                        />
                                    </Col>
                                    <Col md={2} style={{textAlignLast: 'center'}}>
                                        <div id="labelART">
                                            <span style={{width: '100%'}}>FECHA TERMINO</span>
                                        </div>
                                        <DayPickerInput onDayChange={this.handleFechaTermino}
                                                        formatDate={formatDate}
                                                        parseDate={parseDate}
                                                        format="DD/MM/YYYY"
                                                        placeholder={`${formatDate(new Date(), 'DD/MM/YYYY', 'es')}`}
                                                        dayPickerProps={{
                                                            locale: 'es',
                                                            localeUtils: MomentLocaleUtils,
                                                        }}/>
                                    </Col>
                                    <Col md={2}>
                                        <div id="labelART">
                                            <span>CONDICIÓN</span>
                                        </div>
                                        <Input type="select"
                                               id="inputForm"
                                               value={condicion}
                                               onChange={this.handleCondicion}>

                                            <option value="">Seleccionar</option>
                                            <option value="Cumplir dentro del dia">Cumplir en día</option>
                                            <option value="Cumplir dentro de la fecha">Cumplir en fecha</option>
                                        </Input>

                                    </Col>
                                    <Col md={2}>
                                        <div id="labelART">
                                            <span>CRITICO</span>
                                        </div>
                                        <Input type="select"
                                               id="inputForm"
                                               value={critico}
                                               onChange={this.handleCritico}>

                                            <option value="">Seleccionar</option>
                                            <option value={true}>Si</option>
                                            <option value={false}>No</option>

                                        </Input>
                                    </Col>
                                    <Col md={2}>
                                        <div id="labelART">
                                            <span>RESPONSABLE TAREA</span>
                                        </div>
                                        <Input type="select"
                                               id="inputForm"
                                               value={responsable_tarea}
                                               onChange={this.handleResponsableTarea}>
                                            <option value="">Seleccionar</option>
                                            <option value="Supervisor">Supervisor</option>
                                            <option value="Encargado">Encargado</option>
                                            <option value="Gerente">Gerente</option>
                                            <option value="Lider">Lider</option>
                                            <option value="Todo el personal">Todo el personal</option>

                                        </Input>

                                    </Col>

                                    {render === false && modificar === true ?
                                        <Col md={12}>
                                            <div className="contenedor-Btn">
                                                <Button id="style-btn"
                                                        size="sm"
                                                        disabled={!habilitado}
                                                        onClick={() => this.modificarTarea()}
                                                        className="btn-mostrar"> Modificar
                                                </Button>
                                                <Button id="style-btn"
                                                        size="sm"
                                                        onClick={() => this.eliminarTarea()}
                                                        className="btn-mostrar"> Eliminar
                                                </Button>

                                            </div>
                                        </Col> : <Col md={12}>
                                            <div className="contenedor-Btn">
                                                <Button id="style-btn"
                                                        size="sm"
                                                        onClick={this.agregarTarea}
                                                        className="btn-mostrar"> Aceptar
                                                </Button>


                                            </div>
                                        </Col>
                                    }

                                </Col>

                            </Row>
                        </div>
                        }

                    </div>
                    <div className="footer">
                        <footer>
                            <Col md={12}>
                                <span> &copy; 2020 Camila Carrasco.</span>
                            </Col>

                        </footer>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;
