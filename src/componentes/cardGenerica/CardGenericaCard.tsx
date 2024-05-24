import Base from "../../entidades/Base";
import BtnDelete from "../btnDelete/BtnDelete";
import BtnEdit from "../btnEdit/BtnEdit";

export type GrillaGenericaTableProps<T> = {
  entidades: T[],
  labels: string[],
  categoria: number,
  keys: Array<keyof T>,
  openModalPedidos: () => void,
  handleOpenModal: (id: number) => void,
  deleteEntidad: (id: number) => void,
  sinEditar: boolean
};

function CardGenericaCard<T extends Base>({
  entidades,
  categoria,
  handleOpenModal,
  deleteEntidad,
  sinEditar
}: GrillaGenericaTableProps<T>) {
  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-2 justify-content-center">
      {entidades.filter(entidadI => (categoria === 0 || entidadI.categoria.id === categoria)).map((entidadI: T) => (
        <div key={entidadI.id} className="card border-0 mx-2" style={{width: "242px", height:"250px"}}>
        <img src={entidadI.imagen.url} className="card-img-top" style={{height:'165px'}} alt="..." />
        <div className="card-body m-0 p-0">
            <div className="d-flex">
                <div className="col">
                    <h5 className="card-title mb-0">{entidadI.nombre}</h5>
                    <h6 className="card-text my-0">{entidadI.domain}</h6>
                    <p className="card-text" style={{fontSize:'0.8rem'}}>{entidadI.razonSocial}</p>
                </div>
                <div className="col-4 mt-1 d-flex justify-content-between">
                    <BtnEdit handleClick={() => handleOpenModal(entidadI.id)} />
                    <BtnDelete handleClick={() => deleteEntidad(entidadI.id)} />
                </div>
            </div>
        </div>
        </div>
      ))}
    </div>
  );
}

export default CardGenericaCard;
