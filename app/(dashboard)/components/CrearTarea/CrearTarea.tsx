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
    tarea: string;
    horaInicio: string;
  }) => void;
}

export function CrearTareaDialog({
  open,
  onOpenChange,
  onSubmit,
}: CrearTareaDialogProps) {
  const [formData, setFormData] = useState({
    proyecto: '',
    tarea: '',
    horaInicio: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    if (!formData.tarea.trim()) {
      newErrors.tarea = 'El nombre de la tarea es requerido';
    }
    if (!formData.horaInicio) {
      newErrors.horaInicio = 'La hora de inicio es requerida';
    } else if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.horaInicio)) {
      newErrors.horaInicio = 'Formato inválido (HH:MM)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      onOpenChange(false);
      // Resetear formulario después de enviar
      setFormData({ proyecto: '', tarea: '', horaInicio: '' });
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

            {/* Campo: Nombre de la Tarea */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tarea" className="text-right">
                Costos
              </Label>
              <div className="col-span-3">
                <Input
                  id="costos"
                  name="costos"
                  type='number'
                  value={formData.tarea}
                  onChange={handleChange}
                  placeholder="Costo del proyecto"
                />
                {errors.tarea && (
                  <p className="mt-1 text-sm text-red-500">{errors.tarea}</p>
                )}
              </div>
            </div>

            {/* Campo: Sueldo */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tarea" className="text-right">
                Sueldo
              </Label>
              <div className="col-span-3">
                <Input
                  id="sueldo"
                  name="sueldo"
                  type='number'
                  value={formData.tarea}
                  onChange={handleChange}
                  placeholder="Sueldo"
                />
                {errors.tarea && (
                  <p className="mt-1 text-sm text-red-500">{errors.tarea}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tarea" className="text-left">
                Horas trabajadas
              </Label>
              <div className="col-span-3">
                <Input
                  id="horasTrabajadas"
                  name="horasTrabajadas"
                  type='number'
                  value={formData.tarea}
                  onChange={handleChange}
                  placeholder="Horas trabajadas"
                />
                {errors.tarea && (
                  <p className="mt-1 text-sm text-red-500">{errors.tarea}</p>
                )}
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancelar</AlertDialogCancel>
            <AlertDialogAction type="submit">Crear Tarea</AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}