import { useForm } from "react-hook-form";
import ErrorSpan from "@/components/ui/errorSpan";

export default function SedeForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Agregar nueva sede</h2>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={onSubmit}>
          {/* Nombre */}
          <div className="flex flex-col">
            <label htmlFor="nombre" className="text-gray-700 font-medium mb-1">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              {...register("nombre", { required: true, maxLength: 100 })}
              className="border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.nombre?.type === "required" && (
              <ErrorSpan message="El nombre es obligatorio" />
            )}
            {errors.nombre?.type === "maxLength" && (
              <ErrorSpan message="El nombre no puede tener más de 100 caracteres" />
            )}
          </div>

          {/* Dirección */}
          <div className="flex flex-col">
            <label htmlFor="direccion" className="text-gray-700 font-medium mb-1">
              Dirección
            </label>
            <input
              type="text"
              id="direccion"
              {...register("direccion", { required: true, maxLength: 255 })}
              className="border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.direccion?.type === "required" && (
              <ErrorSpan message="La dirección es obligatoria" />
            )}
            {errors.direccion?.type === "maxLength" && (
              <ErrorSpan message="La dirección no puede tener más de 255 caracteres" />
            )}
          </div>

          {/* Ciudad */}
          <div className="flex flex-col">
            <label htmlFor="ciudad" className="text-gray-700 font-medium mb-1">
              Ciudad
            </label>
            <input
              type="text"
              id="ciudad"
              {...register("ciudad", { required: true, maxLength: 50 })}
              className="border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.ciudad?.type === "required" && (
              <ErrorSpan message="La ciudad es obligatoria" />
            )}
            {errors.ciudad?.type === "maxLength" && (
              <ErrorSpan message="La ciudad no puede tener más de 50 caracteres" />
            )}
          </div>

          {/* Departamento */}
          <div className="flex flex-col">
            <label htmlFor="departamento" className="text-gray-700 font-medium mb-1">
              Departamento
            </label>
            <input
              type="text"
              id="departamento"
              {...register("departamento", { required: true, maxLength: 50 })}
              className="border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.departamento?.type === "required" && (
              <ErrorSpan message="El departamento es obligatorio" />
            )}
            {errors.departamento?.type === "maxLength" && (
              <ErrorSpan message="El departamento no puede tener más de 50 caracteres" />
            )}
          </div>

          {/* Teléfono */}
          <div className="flex flex-col">
            <label htmlFor="telefono" className="text-gray-700 font-medium mb-1">
              Teléfono
            </label>
            <input
              type="text"
              id="telefono"
              {...register("telefono", { required: true, minLength: 8, maxLength: 20 })}
              className="border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.telefono?.type === "required" && (
              <ErrorSpan message="El teléfono es obligatorio" />
            )}
            {errors.telefono?.type === "minLength" && (
              <ErrorSpan message="El teléfono debe tener al menos 8 caracteres" />
            )}
            {errors.telefono?.type === "maxLength" && (
              <ErrorSpan message="El teléfono no puede tener más de 20 caracteres" />
            )}
          </div>

          {/* Horario apertura */}
          <div className="flex flex-col">
            <label htmlFor="horario_apertura" className="text-gray-700 font-medium mb-1">
              Horario de apertura
            </label>
            <input
              type="time"
              id="horario_apertura"
              {...register("horario_apertura", { required: true })}
              className="border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.horario_apertura?.type === "required" && (
              <ErrorSpan message="El horario de apertura es obligatorio" />
            )}
          </div>

          {/* Horario cierre */}
          <div className="flex flex-col">
            <label htmlFor="horario_cierre" className="text-gray-700 font-medium mb-1">
              Horario de cierre
            </label>
            <input
              type="time"
              id="horario_cierre"
              {...register("horario_cierre", { required: true })}
              className="border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.horario_cierre?.type === "required" && (
              <ErrorSpan message="El horario de cierre es obligatorio" />
            )}
          </div>

          {/* Botón ocupa toda la fila */}
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow transition-colors"
            >
              Guardar sede
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
