
import { useEffect, useState }from "react";
import Sucursal from "../../entidades/Sucursal";
import { useAtributos } from "../../hooks/useAtributos";

type SeleccionSucursalesArgs = {
    sucursalesPrevias: Sucursal[],
    handleChange: (key: keyof object, value: any) => void
}

function SeleccionSucursales({ sucursalesPrevias, handleChange }: SeleccionSucursalesArgs) {
    const [sucursalesElegidas, setSucursalesElegidas] = useState<Sucursal []>([]);
    const {sucursales, getSucursalesRest} = useAtributos();

    const agregarEliminarSucursal = (sucursalNueva:Sucursal, alta:boolean) => {
        if (alta) {
            setSucursalesElegidas( [...sucursalesElegidas, sucursalNueva] );
        } else {
            setSucursalesElegidas( [...sucursalesElegidas.filter(sucursal => {return sucursal.id !== sucursalNueva.id})] );
        }
    }

    useEffect(() => {
        getSucursalesRest();
    }, []);

    useEffect(() => {
        setSucursalesElegidas(sucursalesPrevias);
    }, [sucursalesPrevias]);

    useEffect(() => {
        handleChange('sucursales' as keyof object, sucursalesElegidas);
    }, [sucursalesElegidas]);

    return (
    <div className="p-3 border rounded">
        
        <div style={{height:'248px', overflowY:'auto'}}>
        <table className='table'>
            <thead>
                <tr className="row-sm">
                    <th>Promoción vigente</th>
                    <th>Sucursal</th>
                    <th>Empresa</th>
                </tr>
            </thead>
            <tbody>
            {sucursales.map((sucursal, index) => (
                <tr key={index} className="row-sm">
                    <td>
                        {sucursalesElegidas.find(sucursalElegida => sucursalElegida.id === sucursal.id) 
                        ? <button type="button" className="btn btn-success" onClick={() => agregarEliminarSucursal(sucursal, false)}>Sí</button>
                        : <button type="button" className="btn btn-danger" onClick={() => agregarEliminarSucursal(sucursal, true)}>No</button>
                        }
                    </td>
                    <td>{sucursal.nombre}</td>
                    <td>{sucursal.empresa.nombre}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    </div>
    );
}

export default SeleccionSucursales;