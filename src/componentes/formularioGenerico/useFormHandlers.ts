import { useCallback } from "react";

function useFormHandlers<T extends object> (
    formData: T,
    setFormData: React.Dispatch<React.SetStateAction<T>>,
    errors: { [key in keyof T]?: string },
    setErrors: React.Dispatch<React.SetStateAction<{ [key in keyof T]?: string }>>,
    listaSelects: any,
    onSubmit: (formData: T) => void
  ) {

    const handleChange = useCallback((atributo: keyof T, valor: any) => {
        let finalValue: any;

        if (valor instanceof HTMLSelectElement) {
        finalValue = listaSelects[atributo][0].find((element: { id: any; }) => String(element.id) === String(valor.value));
        if (typeof formData[atributo] === 'string') {
            finalValue = finalValue.denominacion;
        }
        } else if (typeof formData[atributo] === 'number') {
        finalValue = Number(valor);
        } else {
        finalValue = valor;
        }

        const newData = { ...formData, [atributo]: finalValue };

        errors[atributo] = '';
        setFormData(newData);
    }, [formData, listaSelects, setErrors, setFormData]);

    const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: { [key in keyof T]?: string } = {};
        
        Object.keys(formData).forEach(key => {
            if (listaSelects[key] && (formData[key as keyof T] as { id:number} ).id === 0) {
                newErrors[key as keyof T] = 'Por favor, seleccione una opción.';
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            onSubmit(formData);
        }
    }, [formData, listaSelects, onSubmit, setErrors]);

    return {
        handleChange,
        handleSubmit
    }
}

export default useFormHandlers;