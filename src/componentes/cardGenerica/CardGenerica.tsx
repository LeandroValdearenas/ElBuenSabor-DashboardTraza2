import { useEffect, useRef, useState } from "react";
import Base from "../../entidades/Base";
import FormularioGenerico from "../formularioGenerico/FormularioGenerico";
import BackendClient from "../../servicios/BackendClient";
import { usePedidos } from "../../hooks/usePedidos";
import ModalGenerico from "../modalGenerico/ModalGenerico";
import CardGenericaCard from "./CardGenericaCard";
import useGrillaHandlers from "../grillaGenerica/useGrillaHandler";

type ListArgs<T extends Base> = {
  entidadPrevia: T,
  entidadBase: T,
  apiServicio: BackendClient<T>,
  listaSelects?: {},
  sinNuevo?: boolean,
  sinEditar?: boolean
}

function CardGenerica<T extends Base>({ entidadPrevia, entidadBase, apiServicio, listaSelects = {}, sinNuevo = false, sinEditar = false }: ListArgs<T>) {
  const [entidad, setEntidad] = useState<T>(entidadPrevia);
  const [entidades, setEntidades] = useState<T[]>([]);
  const [categoria, setCategoria] = useState<number>(0);
  const [labels, setLabels] = useState<string[]>([]);
  
  const { modalPedidos, openModalPedidos } = usePedidos();
  const modalRef = useRef<any>(null);

  const { getDatosRest, deleteEntidad, save, handleOpenModal } = useGrillaHandlers({
    entidad,
    setEntidad,
    entidades,
    setEntidades,
    apiServicio,
    categoria,
    setCategoria,
    listaSelects,
    entidadBase,
    modalRef
  });

  useEffect(() => {
    getDatosRest();
  }, []);

  useEffect(() => {
    setLabels((entidadBase as any).constructor.labels as string[]);
  }, [entidadBase]);

  return (
    <>
      <ModalGenerico titulo={(entidadBase as any).constructor.name} tituloModal={(entidadBase as any).constructor.nombre} ref={modalRef}>
        <FormularioGenerico data={entidad} onSubmit={save} listaSelects={listaSelects} />
      </ModalGenerico>

      {modalPedidos}

      <div style={{ height: '89vh', display: 'flex', flexDirection: 'column' }}>
        
        <CardGenericaCard
          entidades={entidades}
          labels={labels}
          categoria={categoria}
          keys={Object.keys(entidad) as Array<keyof T>}
          openModalPedidos={openModalPedidos}
          handleOpenModal={handleOpenModal}
          deleteEntidad={deleteEntidad}
          sinEditar={sinEditar}
        />

        {!sinNuevo && (
            <div className="d-flex my-3 mx-1 row">
              <a
                className="btn btn-sm btn-secondary"
                onClick={() => {
                  handleOpenModal(0);
                }}
              >
                Nuevo
              </a>
            </div>
          )}
      </div>
    </>
  );
}

export default CardGenerica;