import React, { useState } from "react";
import { InputField, Spinner } from "../../components/index";
import { apiRequest } from "../../services/index";
import { showAlert } from "../../utils/alerts";
import { ApiResponse } from "../../interfaces";
import {  useBranch } from "../../context/BranchContext"; // <-- importamos el contexto
import "./AddBranchForm.css";

export function AddBranchForm() {
  const { setBranch, clearBranch } = useBranch(); // usamos funciones del contexto

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [phone, setPhone] = useState("");
  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!name.trim() || !address.trim() || !city.trim() || !stateRegion.trim() || !phone.trim()) {
      showAlert("Por favor, completa todos los campos requeridos.");
      return;
    }

    if (!openingTime || !closingTime) {
      showAlert("Por favor, establece los horarios de apertura y cierre.");
      return;
    }

    if (openingTime >= closingTime) {
      showAlert("La hora de cierre debe ser posterior a la hora de apertura.");
      return;
    }

    if (phone.length < 7) {
      showAlert("El número de teléfono debe tener al menos 7 dígitos.");
      return;
    }

    setLoading(true);

    try {
      const branchData = {
        name: name.trim(),
        address: address.trim(),
        city: city.trim(),
        stateRegion: stateRegion.trim(),
        phone: phone.trim(),
        openingTime,
        closingTime,
        status: "ACTIVE" // se fija como valor inicial
      };
      

      //Llamada al backend
      const result: ApiResponse<any> = await apiRequest<any>(
        "/api/branches",
        "POST",
        branchData
      );

      if (result.success) {
        showAlert(result.message || "¡Sede creada exitosamente!", "success");
        
        //Guardar la sede en el contexto
        setBranch(result.data);

        // Limpiar formulario
        resetForm();
        
        // Redirigir después de un momento
        setTimeout(() => {
          window.location.href = "/branches";
        }, 1500);
      } else {
        showAlert(result.message || "Error al crear la sede.");
      }
    } catch {
      showAlert("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setAddress("");
    setCity("");
    setStateRegion("");
    setPhone("");
    setOpeningTime("");
    setClosingTime("");
    clearBranch();
  };

  const handleCancel = () => {
    window.location.href = "/";
  };

  return (
    <div className="add-branch-container">
      <div className="add-branch-header">
        <div className="cancel-btn-container">
          <button 
            type="button" 
            className="cancel-btn"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
        
        <h1>Agregar Nueva Sede</h1>
        <p>Complete la información para registrar una nueva sede de parqueadero</p>
      </div>

      <form className="add-branch-form" onSubmit={handleSubmit}>
        <div className="form-columns">
          <div className="form-section">
            <h3>Información Básica</h3>
            <div className="input-group">
              <InputField
                id="name"
                label="Nombre de la Sede *"
                placeholder="Ej: Sede Centro"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <InputField
                id="address"
                label="Dirección *"
                placeholder="Dirección completa"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Ubicación</h3>
            <div className="input-group">
              <InputField
                id="city"
                label="Ciudad *"
                placeholder="Ciudad"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />

              <InputField
                id="stateRegion"
                label="Departamento/Estado *"
                placeholder="Departamento"
                value={stateRegion}
                onChange={(e) => setStateRegion(e.target.value)}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Contacto</h3>
            <div className="input-group">
              <InputField
                id="phone"
                label="Teléfono *"
                placeholder="Número de contacto"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Horarios</h3>
            <div className="input-group">
              <InputField
                id="openingTime"
                label="Hora de Apertura *"
                type="time"
                value={openingTime}
                onChange={(e) => setOpeningTime(e.target.value)}
              />

              <InputField
                id="closingTime"
                label="Hora de Cierre *"
                type="time"
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span>Creando...</span>
                <Spinner />
              </>
            ) : (
              <span>Crear Sede</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}