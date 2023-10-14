import { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'



const Clientes = () => {
  const url = 'http://localhost:3000/contacts'

  const [Clientes, setClientes] = useState([]) // Lista de Clientes
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [operacion, setOperacion] = useState() // 1: Nuevo, 2: Editar
  const [title, setTitle] = useState('') // 1: Nuevo, 2: Editar para mostrar en el modal
  const [loadign,setLoading] = useState(false) 

  //------------------ renderizar lista de clientes ------------------
  useEffect(() => { 
    getClientes();
  }, [])

  //------------------ obtener todos los clientes en nuestra API ------------------
  const getClientes = async () => {
    try {
        
      const response = await axios.get(url) // url: http://localhost:3000/contacts
  
      setClientes(response.data)
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  //------------------ funcion para elegir la operacion ------------------
  const openModal = (op,id,name,phone,email) => {
    //setear los valores de los campos
    setId('')
    setName('')
    setPhone('')
    setEmail('')


    setOperacion(op)
    if(op===1){
      setTitle('Nuevo Cliente')
    }else if(op===2){
      setTitle('Editar Clientes')
      setId(id)
      setName(name)
      setPhone(phone)
      setEmail(email)
    }
    //fucus en el campo name**document.getElementById('name').focus()
    window.setTimeout(function () {
      document.getElementById('name').focus()
    },500)
  }

  //------------------ funcion para validar los campos ------------------

  const validar = () => {
    if(name===''){
      Swal.fire({
        text: 'El campo Nombre es obligatorio',
        icon: 'warning',
      })
    }else if(phone===''){
      Swal.fire({
        text: 'El campo Phone es obligatorio',
        icon: 'warning',
      })
    }else if(email===''){
      Swal.fire({
        text: 'El campo email es obligatorio',
        icon: 'warning',
      })
    }else{
      if(operacion===1){
        addCliente()
      }else if(operacion===2){
        updateCliente()
      }
    }
  }

  //------------------ funcion para agregar un cliente ------------------
  const addCliente = async () => {
   Swal.fire({
      title: '¿Está seguro de agregar el cliente?',
      text: name,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then(async(result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(url, {
            name: name,
            phone: phone,
            email: email,
          })
          console.log(response.data)
          await getClientes()
          document.getElementById('btnCerrar').click()
        } catch (error) {
          console.log(error)
        }
      }
    })
  }

  //------------------ funcion para actualizar un cliente ------------------

  const updateCliente = async () => {
    Swal.fire({
      title: '¿Está seguro de actualizar el cliente?',
      text: name,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then(async (result) => { // async: es para que espere a que se ejecute await y luego continue el codigo
      if (result.isConfirmed) {
        try {
          const response = await axios.put(`${url}/${id}`, {
            name: name,
            phone: phone,
            email: email,
          })
  
          await getClientes()
          document.getElementById('btnCerrar').click()
        } catch (error) {
          console.log(error)
        }
      }
    })
  }

  //------------------ funcion para eliminar un cliente ------------------

  const deleteCliente = async (cliente) => {
    
    Swal.fire({
      title: `¿Está seguro de eliminar el cliente? ${cliente.name}`,
      text: cliente.name,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then(async (result) => { // async: es para que espere a que se ejecute await y luego continue el codigo
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${url}/${cliente.id}`)
          console.log(response.data)
          await getClientes()
        } catch (error) {
          console.log(error)
        }
      }
    })
  }


  return (
    <div className='App'>
      {/*  Boton de Agregar Clientes */}
      <div className='container-fluid'>
        <div className='row mt-3'>
          <div className='col-md-4 offset-md-4'>
            <div className='d-grid mx-auto'>
              <button onClick={()=>openModal(1)} className='btn btn-dark btn-block' data-bs-toggle='modal' data-bs-target='#modalClientes'>
                <i className='fa-solid fa-circle-plus'></i> Agregar Cliente
              </button>
            </div>
          </div>
        </div>

        {/*  Tabla de Clientes */}

        <div className='col-md-8 offset-md-2 py-3'>
          <table className='table table-striped table-hover'>
            <thead>
              <tr>
                <th>#</th>
                <th>Seleccion</th>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className='table-group-divider'>
              {
                Clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{
                        <>
                          <input className='form-check-input' type='checkbox' value={cliente.id} id='flexCheckDefault' />
                        </>
                      }</td>
                    <td>{cliente.id}</td>
                    <td>{cliente.name}</td>
                    <td>{cliente.phone}</td>
                    <td>{cliente.email}</td>
                    <td>
                      <button onClick={()=>openModal(2,cliente.id,cliente.name,cliente.phone,cliente.email)} 
                          className='btn btn-sm btn-outline-warning mx-1' data-bs-toggle='modal' data-bs-target='#modalClientes'>
                        <i className='fa-solid fa-pencil'></i>
                      </button>
                      <button onClick={()=>deleteCliente(cliente)} className='btn btn-sm btn-outline-danger' >
                        <i className='fa-solid fa-trash'></i>
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/*  Modal de Clientes */}
      <div id='modalClientes' className='modal fade' aria-hidden='true'>
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <label className='h5'>{title}</label>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            {/* Cuerpo del Modal */}
            <div className='modal-body'>
              <input type='hidden' id='id' value={id}></input>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className="fa-solid fa-user"></i></span>
                <input
                  type='text'
                  id='name'
                  className='form-control'
                  placeholder='Nombre'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className="fa-solid fa-phone"></i></span>
                <input
                  type='phone'
                  id='phone'
                  className='form-control'
                  placeholder='Phone'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text'><i className="fa-solid fa-envelope"></i></span>
                <input
                  type='email'
                  id='email'
                  className='form-control'
                  placeholder='Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {/* Boton Guardar */}
              <div className='d-grid col-6 mx-auto'>
                <button onClick={()=>validar()} className='btn btn-success btn-block'>
                  <i className='fa-solid fa-save'></i> Guardar
                </button>
              </div>
            </div>
            {/* Pie del Modal */}
            <div className='modal-footer'>
              <button id= 'btnCerrar' type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
                <i className='fa-solid fa-window-close'></i> Cerrar
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Clientes
