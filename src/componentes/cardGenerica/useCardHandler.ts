import { ChangeEvent, useCallback } from 'react';

import BackendClient from "../../servicios/BackendClient";
import { RefObject } from "react";
import Base from '../../entidades/Base';

export type UseGrillaHandlersProps<T> = {
  entidad: T,
  setEntidad: (entidad: T) => void,
  entidades: T[],
  setEntidades: (entidades: T[]) => void,
  apiServicio: BackendClient<T>,
  categoria: number,
  setCategoria: (categoria: number) => void,
  listaSelects: {},
  entidadBase: T,
  modalRef: RefObject<any>
};

function useCardHandler<T extends Base>({
  entidad,
  setEntidad,
  entidades,
  setEntidades,
  apiServicio,
  setCategoria,
  entidadBase,
  modalRef
}: UseGrillaHandlersProps<T>) {
  const getDatosRest = useCallback(async () => {
    const datos: T[] = await apiServicio.getAll();
    setEntidades(datos);
  }, [apiServicio, setEntidades]);

  const deleteEntidad = useCallback(async (id: number) => {
    try {
      await apiServicio.delete(id);
    } catch {
      alert(`Hubo un conflicto. Asegúrese de que ${(entidad as any).constructor.nombre} no esté utilizándose en otros datos.`);
    }
    getDatosRest();
  }, [apiServicio, (entidad as any).constructor.name, getDatosRest]);

  const save = useCallback(async (formData: T) => {
    if (formData.id === 0) {
      await apiServicio.post(formData);
    } else {
      await apiServicio.put(formData.id, formData);
    }
    getDatosRest();
    const modalClose: HTMLElement | null = document.getElementById(`btn-close-${(entidad as any).constructor.name}`);
    modalClose?.click();
  }, [apiServicio, (entidad as any).constructor.name, getDatosRest]);

  const cambiarElaborar = useCallback(async (value: number) => {
    const nuevo: T = entidades.find((entidad: T) => entidad.id === value)!;
    (nuevo as any).esParaElaborar = !(nuevo as any).esParaElaborar;
    (nuevo as any).type = 'insumo';
    save(nuevo);
  }, [entidades, save]);

  const handleChangeCategoria = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setCategoria(Number(e.target.value));
  }, [setCategoria]);

  const handleOpenModal = useCallback((id: number) => {
    if (id) {
      const seleccion: T = entidad;
      Object.assign(seleccion, entidades.find(a => a.id === id)!);
      if (entidad.constructor.name === 'Cliente') {
        (seleccion as any).pedidos = [];
      }
      setEntidad(seleccion);
    } else {
      const nueva: T = entidad;
      Object.assign(entidad, entidadBase);
      setEntidad(nueva);
    }
    modalRef.current.openModal();
  }, [entidad, setEntidad, entidades, entidadBase, modalRef]);

  return {
    getDatosRest,
    deleteEntidad,
    save,
    cambiarElaborar,
    handleChangeCategoria,
    handleOpenModal
  };
}

export default useCardHandler;
