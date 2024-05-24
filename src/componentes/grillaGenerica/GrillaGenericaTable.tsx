import Base from "../../entidades/Base";
import Domicilio from "../../entidades/Domicilio";

export type GrillaGenericaTableProps<T> = {
  entidades: T[],
  labels: string[],
  categoria: number,
  keys: Array<keyof T>,
  openModalPedidos: () => void,
  openModalDomicilios: (domicilios: Domicilio[]) => void,
  cambiarBooleano: (value: number, atributo:string) => void,
  handleOpenModal: (id: number) => void,
  deleteEntidad: (id: number) => void,
  sinEditar: boolean
};

function GrillaGenericaTable<T extends Base>({
  entidades,
  labels,
  categoria,
  keys,
  openModalPedidos,
  openModalDomicilios,
  cambiarBooleano,
  handleOpenModal,
  deleteEntidad,
  sinEditar
}: GrillaGenericaTableProps<T>) {
  return (
    <table className='table table-striped text-center'>
      <thead>
        <tr>
          {labels && labels.map((label: string, index: number) => (
            <th key={index} scope="col" hidden={['Id', 'Imágen', 'Imágenes', 'Cargar detalles', 'Tiene sucursales', 'Promociones'].includes(label)}>
              <b>{label}</b>
            </th>
          ))}
          {!sinEditar && <th scope="col"><b>Modificar</b></th>}
          <th scope="col"><b>Eliminar</b></th>
        </tr>
      </thead>
      <tbody>
        {entidades.filter(entidadI => (categoria === 0 || entidadI.categoria.id === categoria)).map((entidadI: T) => (
          <tr key={entidadI.id}>
            {keys.map((key, index) => (
              <td key={index} hidden={['id', 'imagen', 'imagenes', 'articuloManufacturadoDetalles', 'sucursales', 'promocionDetalles', 'type', 'promociones'].includes(String(key))}>
                {!['esParaElaborar', 'casaMatriz'].includes(String(key))
                  ? (!['domicilios', 'pedidos'].includes(String(key))
                    ? <b>{typeof entidadI[key] === 'object' 
                          ? (entidadI[key].denominacion || entidadI[key].nombre || (entidadI[key].calle + ' ' + entidadI[key].numero)) 
                          : (typeof entidadI[key] === 'number' ? entidadI[key].toLocaleString('es-AR') : entidadI[key])}
                      </b>
                    : <a className="btn btn-dark" style={{ marginBottom: 10 }} onClick={() => { key === 'pedidos' ? openModalPedidos() : openModalDomicilios(entidadI.domicilios) }}> {labels[index]} </a>)
                  : <a className={entidadI[key] ? "btn btn-success" : "btn btn-dark"} style={{ width: '100px', marginBottom: 10 }} onClick={() => { cambiarBooleano(entidadI.id, String(key)) }}>{entidadI[key] ? "Sí" : "No"}</a>
                }
              </td>
            ))}
            {!sinEditar && (
              <td>
                <a className="btn btn-info" style={{ marginBottom: 10 }} onClick={() => { handleOpenModal(entidadI.id) }}>Modificar</a>
              </td>
            )}
            <td>
              <a className="btn btn-danger" style={{ marginBottom: 10 }} onClick={() => deleteEntidad(entidadI.id)}>Eliminar</a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default GrillaGenericaTable;
