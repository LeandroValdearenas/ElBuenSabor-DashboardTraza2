import { useContext } from "react"
import { PedidosContext } from "../context/PedidosContext";

export const usePedidos = () => {
    const context = useContext(PedidosContext);

    if (context === undefined) {
        throw new Error("usePedidos debe ser usado dentre del ámbito de un PedidosContextProvider");
    }

    return context;
}