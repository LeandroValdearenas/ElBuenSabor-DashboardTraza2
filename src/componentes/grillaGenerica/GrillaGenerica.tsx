import { useEffect, useRef, useState } from "react";
import CboBoxFiltrar from "../cboBoxFiltrar/CboBoxFiltrar";
import { useAtributos } from "../../hooks/useAtributos";
import Base from "../../entidades/Base";
import FormularioGenerico from "../formularioGenerico/FormularioGenerico";
import BackendClient from "../../servicios/BackendClient";
import { usePedidos } from "../../hooks/usePedidos";
import useGrillaHandlers from "./useGrillaHandler";
import ModalGenerico from "../modalGenerico/ModalGenerico";
import GrillaGenericaTable from "./GrillaGenericaTable";
import { useDomicilios } from "../../hooks/useDomicilios";

type ListArgs<T extends Base> = {
  entidadPrevia: T,
  entidadBase: T,
  apiServicio: BackendClient<T>,
  listaSelects?: {},
  sinNuevo?: boolean,
  sinEditar?: boolean
}

function GrillaGenerica<T extends Base>({ entidadPrevia, entidadBase, apiServicio, listaSelects = {}, sinNuevo = false, sinEditar = false }: ListArgs<T>) {
  const [entidad, setEntidad] = useState<T>(entidadPrevia);
  const [entidades, setEntidades] = useState<T[]>([]);
  const { categorias } = useAtributos();
  const [categoria, setCategoria] = useState<number>(0);
  const [labels, setLabels] = useState<string[]>([]);
  
  const { modalPedidos, openModalPedidos } = usePedidos();
  const { modalDomicilios, openModalDomicilios } = useDomicilios();
  const modalRef = useRef<any>(null);

  const { getDatosRest, deleteEntidad, save, cambiarBooleano, handleChangeCategoria, handleOpenModal } = useGrillaHandlers({
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
      {modalDomicilios}

      <div style={{ height: '89vh', display: 'flex', flexDirection: 'column' }}>
        {Object.keys(entidad).includes('categoria') && (
          <div className="row mb-3 ms-auto" style={{width:'25%'}}>
            <div className="col">
              <CboBoxFiltrar
                idCboInput="Categoria"
                titulo="Categoría"
                datos={categorias.filter((categoria) =>
                  entidades.map((entidad) => entidad.categoria.id).includes(categoria.id)
                )}
                handleChange={handleChangeCategoria}
              />
            </div>
          </div>
        )}

        <GrillaGenericaTable
          entidades={entidades}
          labels={labels}
          categoria={categoria}
          keys={Object.keys(entidad) as Array<keyof T>}
          openModalPedidos={openModalPedidos}
          openModalDomicilios={openModalDomicilios}
          cambiarBooleano={cambiarBooleano}
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

export default GrillaGenerica;