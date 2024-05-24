import ArticuloInsumo from "../../entidades/ArticuloInsumo";
import Empleado from "../../entidades/Empleado";
import Promocion from "../../entidades/Promocion";
import DomicilioForm from "../domicilios/DomicilioForm";
import Domicilios from "../domicilios/Domicilios";
import CargarImagen from "../cargarImagenes/CargarImagen";
import CargarImagenes from "../cargarImagenes/CargarImagenes";
import PromocionCargarDetalles from "../promocionCargarDetalles/PromocionCargarDetalles";
import SeleccionSucursales from "../seleccionSucursales/SeleccionSucursales";

type InputRendererProps<T> = {
    atributo: keyof T;
    value: any;
    listaSelects: any;
    data: T;
    handleChange: (key: keyof T, value: any) => void;
    errors: { [key in keyof T]?: string };
  };

function InputRenderer<T>({ atributo, value, listaSelects, data, handleChange, errors }: InputRendererProps<T>) {
    switch(atributo) {
      case 'imagen':
        return <CargarImagen imagenPrevia={(data as Empleado).imagen} handleChange={handleChange} />
      case 'imagenes':
        return <CargarImagenes imagenes={(data as ArticuloInsumo).imagenes} handleChange={handleChange} />
      case 'promocionDetalles':
        return <PromocionCargarDetalles detallesPrevios={(data as Promocion).promocionDetalles} handleChange={handleChange} />
      case 'promocionesxxxxx':
        return <SeleccionSucursales sucursalesPrevias={(data as Promocion).sucursales} handleChange={handleChange} />
      case 'domicilio':
        return <DomicilioForm domicilioPrevio={(data as Empleado).domicilio} handleChangeDomicilio={handleChange} />
      case 'domicilios':
        return <Domicilios editar domiciliosPrevios={(data as Empleado).domicilios} handleChange={handleChange} />
      case 'preparacion':
        return (
          <textarea
              id={String(atributo)}
              className='form-control'
              rows={3}
              value={String(value)}
              onChange={(e) => handleChange(atributo, e.target.value)}
              required
          />
        );
    } 
    
    if (listaSelects[atributo]) 
      {
        return (
          <>
          <div className='d-flex'>
            <select
                id= {String(atributo)}
                className= 'form-select'
                value= {value ? ((typeof value === 'string' ? value : (value as { id:any }).id)) : '0'}
                onChange= {(e) => handleChange(atributo, e.target)}
                required
              >
              <option disabled value={0}>Seleccionar</option>
              {listaSelects[atributo][0].map((dato: any) => (
                <option key={dato.id} value={dato.id}>{dato.denominacion||dato.nombre}</option>
              ))}
            </select>
            
            {listaSelects[atributo].length > 1 && 
              listaSelects[atributo][1]
            }
          </div>
          {errors[atributo] && <div className='ms-1 mt-1 text-danger'>{errors[atributo]}</div>}
          </>
        );
      } 
      else if (atributo.toString().includes('fecha')) 
      {
        return (
          <input
              type='date'
              id={String(atributo)}
              className='form-control'
              value={String(value)}
              onChange={(e) => handleChange(atributo, e.target.value)}
              required
            />
        );
      } 
      else if (atributo.toString().includes('hora')) 
      {
        return (
          <input
              type='time'
              id={String(atributo)}
              className='form-control'
              value={String(value)}
              onChange={(e) => handleChange(atributo, e.target.value)}
              required
            />
        );
      }
      else if (atributo === 'rol') {
        return (
          <input
              type='text'
              id={String(atributo)}
              className='form-control'
              value={String(value)}
              disabled
            />
        );
      }
      else {
        return (
          <input
              type={typeof data[atributo] === 'number' ? 'number' : 'text'}
              id={String(atributo)}
              className='form-control'
              min='0'
              max='100000000'
              step='0.01'
              value={String(value)}
              onChange={(e) => handleChange(atributo, e.target.value)}
              required
            />
        );
      }
    };

    export default InputRenderer;