import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { InputField } from "@/components/InputField/InputField";
import { apiRequest } from "@/services";
import { ApiResponse } from "@/interfaces";
import { Branch, UpdateBranchRequest, BranchStatus } from "@/interfaces/Branch";
import { showAlert } from "@/utils/alerts";
import { EditIcon } from "lucide-react";

interface BranchSheetProps {
  branch: Branch | null;
  onUpdateBranch?: (updatedBranch: Branch) => void;
}

export default function BranchSheet({
  branch,
  onUpdateBranch,
}: BranchSheetProps) {
  // Estados iniciales en null o vacío
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [status, setStatus] = useState<BranchStatus>("inactive");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // Sincroniza estados cuando branch cambia
  useEffect(() => {
    if (branch) {
      setName(branch.name || "");
      setAddress(branch.address || "");
      setCity(branch.city || "");
      setDepartment(branch.department || "");
      setPhone(branch.phone || "");
      setStatus(branch.status || "inactive");
    } else {
      // Si no hay branch, limpia el formulario
      setName("");
      setAddress("");
      setCity("");
      setDepartment("");
      setPhone("");
      setStatus("inactive");
    }
  }, [branch]);

  const statusOptions = [
    { value: "active", label: "Activa" },
    { value: "inactive", label: "Inactiva" },
  ];

  const validateForm = (): boolean => {
    if (!name.trim()) return showError("El nombre es requerido");
    if (name.length > 100)
      return showError("El nombre no puede exceder 100 caracteres");
    if (!address.trim()) return showError("La dirección es requerida");
    if (address.length > 255)
      return showError("La dirección no puede exceder 255 caracteres");
    if (!city.trim()) return showError("La ciudad es requerida");
    if (city.length > 50)
      return showError("La ciudad no puede exceder 50 caracteres");
    if (!department.trim()) return showError("El departamento es requerido");
    if (department.length > 50)
      return showError("El departamento no puede exceder 50 caracteres");
    if (phone && phone.length > 20)
      return showError("El teléfono no puede exceder 20 caracteres");
    if (phone && !/^\d+$/.test(phone))
      return showError("El teléfono solo debe contener números");
    return true;
  };

  const showError = (msg: string): false => {
    setError(msg);
    showAlert(msg, "error");
    return false;
  };

  const hasChanges = (): boolean => {
    if (!branch) return false;
    return (
      name !== branch.name ||
      address !== branch.address ||
      city !== branch.city ||
      department !== branch.department ||
      phone !== (branch.phone || "") ||
      status !== branch.status
    );
  };

  const handleUpdate = async () => {
    if (!branch) {
      showAlert("No hay sede seleccionada", "warning");
      return;
    }

    if (!validateForm()) return;

    if (!hasChanges()) {
      showAlert("No hay cambios para guardar", "warning");
      return;
    }

    const payload: UpdateBranchRequest = {
      name: name.trim(),
      address: address.trim(),
      city: city.trim(),
      department: department.trim(),
      phone: phone.trim() || null,
      status: status,
    };

    try {
      setLoading(true);
      setError(null);

      const response: ApiResponse<Branch> = await apiRequest<Branch>(
        `/api/branches/${branch.id}`,
        "PUT",
        payload
      );

      if (response.success && response.data) {
        showAlert("Sede actualizada correctamente", "success");
        onUpdateBranch?.(response.data);
        setOpen(false);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        const msg = response.message || "Error al actualizar la sede";
        showError(msg);
      }
    } catch (error: any) {
      console.error("Error al actualizar sede:", error);
      showError(error.message || "Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen && branch) {
      // Restaurar valores originales solo si hay branch
      setName(branch.name || "");
      setAddress(branch.address || "");
      setCity(branch.city || "");
      setDepartment(branch.department || "");
      setPhone(branch.phone || "");
      setStatus(branch.status || "inactive");
      setError(null);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger className="w-full" disabled={!branch}>
        <Button
          size="sm"
          variant="default"
          className="w-full records-button-header btn-create-entry"
          disabled={!branch}
        >
          <EditIcon /> {branch ? "Editar datos de sede" : "Cargando sede"}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[350px] sm:w-[500px] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>
            {branch ? "Editar Sede" : "Sin sede seleccionada"}
          </SheetTitle>
          <SheetDescription>
            {branch
              ? `Modifica la información de la sede "${branch.name}"`
              : "Seleccione una sede para editar sus datos."}
          </SheetDescription>
        </SheetHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm mt-4">
            ⚠️ {error}
          </div>
        )}

        {branch && (
          <>
            <div className="grid flex-1 auto-rows-min gap-4 px-4 mt-4">
              <InputField
                id="name"
                label="Nombre *"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <InputField
                id="address"
                label="Dirección *"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <InputField
                id="city"
                label="Ciudad *"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <InputField
                id="department"
                label="Departamento *"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
              <InputField
                id="phone"
                label="Teléfono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <InputField
                id="status"
                label="Estado"
                type="select"
                value={status}
                onChange={(e) => setStatus(e.target.value as BranchStatus)}
                options={statusOptions}
              />
            </div>

            <SheetFooter className="mt-6 px-4 flex flex-col gap-3">
              <Button
                onClick={handleUpdate}
                className="w-full"
                disabled={loading || !hasChanges()}
              >
                {loading ? "Guardando..." : "Guardar cambios"}
              </Button>
              <SheetClose asChild>
                <Button variant="outline" className="w-full" disabled={loading}>
                  Cancelar
                </Button>
              </SheetClose>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
