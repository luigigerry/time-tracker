// components/CrearTareaDialog.tsx
'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CrearTareaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    proyecto: string;
    costos: number;
    sueldo: number;
    horasTrabajadas: number;
  }) => void;
}

export function CrearTareaDialog({
  open,
  onOpenChange,
  onSubmit,
}: CrearTareaDialogProps) {
  const [formData, setFormData] = useState({
    proyecto: '',
    costos: 0,
    sueldo: 0,
    horasTrabajadas: 0,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'proyecto' ? value : Number(value) 
    }));
    
    // Limpiar errores al editar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.proyecto.trim()) {
      newErrors.proyecto = 'El nombre del proyecto es requerido';
    }
    if (formData.costos <= 0) {
      newErrors.costos = 'El costo debe ser mayor a 0';
    }
    if (formData.sueldo <= 0) {
      newErrors.sueldo = 'El sueldo debe ser mayor a 0';
    }
    if (formData.horasTrabajadas <= 0) {
      newErrors.horasTrabajadas = 'Las horas trabajadas deben ser mayores a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        proyecto: formData.proyecto,
        costos: formData.costos,
        sueldo: formData.sueldo,
        horasTrabajadas: formData.horasTrabajadas
      });
      onOpenChange(false);
      // Resetear formulario después de enviar
      setFormData({ proyecto: '', costos: 0, sueldo: 0, horasTrabajadas: 0 });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <form onSubmit={handleSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle>Nuevo Proyecto</AlertDialogTitle>
          </AlertDialogHeader>

          <div className="grid gap-4 py-4">
            {/* Campo: Nombre del Proyecto */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="proyecto" className="text-right">
                Proyecto
              </Label>
              <div className="col-span-3">
                <Input
                  id="proyecto"
                  name="proyecto"
                  value={formData.proyecto}
                  onChange={handleChange}
                  placeholder="Nombre del proyecto"
                />
                {errors.proyecto && (
                  <p className="mt-1 text-sm text-red-500">{errors.proyecto}</p>
                )}
              </div>
            </div>

            {/* Campo: Costos del Proyecto */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="costos" className="text-right">
                Costos
              </Label>
              <div className="col-span-3">
                <Input
                  id="costos"
                  name="costos"
                  type="number"
                  min="0"
                  // value={formData.costos}
                  onChange={handleChange}
                  placeholder="Costo del proyecto"
                />
                {errors.costos && (
                  <p className="mt-1 text-sm text-red-500">{errors.costos}</p>
                )}
              </div>
            </div>

            {/* Campo: Sueldo por Hora */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sueldo" className="text-right">
                Sueldo/Hora
              </Label>
              <div className="col-span-3">
                <Input
                  id="sueldo"
                  name="sueldo"
                  type="number"
                  min="0"
                  // value={formData.sueldo}
                  onChange={handleChange}
                  placeholder="Sueldo por hora"
                />
                {errors.sueldo && (
                  <p className="mt-1 text-sm text-red-500">{errors.sueldo}</p>
                )}
              </div>
            </div>

            {/* Campo: Horas Trabajadas */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="horasTrabajadas" className="text-right">
                Horas
              </Label>
              <div className="col-span-3">
                <Input
                  id="horasTrabajadas"
                  name="horasTrabajadas"
                  type="number"
                  min="0"
                  // value={formData.horasTrabajadas}
                  onChange={handleChange}
                  placeholder="Horas trabajadas (ej. 1.5)"
                />
                {errors.horasTrabajadas && (
                  <p className="mt-1 text-sm text-red-500">{errors.horasTrabajadas}</p>
                )}
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancelar</AlertDialogCancel>
            <AlertDialogAction type="submit">Crear Proyecto</AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}