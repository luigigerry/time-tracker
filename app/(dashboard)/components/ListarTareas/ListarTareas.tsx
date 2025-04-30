'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ClockIcon, Trash2, Edit, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
// import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Proyecto {
  id: number;
  nombre: string;
  descripcion: string | null;
  fechaInicio: string;
  fechaFin: string | null;
  registros: {
    horas: number;
    fecha: string;
  }[];
}

export function ListaProyectos() {
  const { user } = useUser();
  // const router = useRouter();
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/proyectos');
        
        if (!response.ok) {
          throw new Error('Error al obtener proyectos');
        }

        const data = await response.json();
        setProyectos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error('Error fetching proyectos:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchProyectos();
    }
  }, [user?.id]);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/proyectos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar proyecto');
      }

      toast.success('Proyecto eliminado correctamente');
      // Actualizar la lista de proyectos
      setProyectos(proyectos.filter(proyecto => proyecto.id !== id));
    } catch (error) {
      toast.error('No se pudo eliminar el proyecto');
      console.error('Error deleting project:', error);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-600">
        Error: {error}
      </div>
    );
  }

  if (proyectos.length === 0) {
    return (
      <div className="rounded-md border border-blue-200 bg-blue-50 p-4 text-blue-600">
        No hay proyectos registrados. Crea tu primer proyecto para comenzar.
      </div>
    );
  }

  // Calcular horas totales por proyecto
  const proyectosConTotales = proyectos.map(proyecto => ({
    ...proyecto,
    horasTotales: proyecto.registros.reduce((sum, reg) => sum + reg.horas, 0)
  }));

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table className="min-w-[800px]">
        <TableHeader>
          <TableRow>
            <TableHead className='w-[200px]'>Nombre</TableHead>
            <TableHead className='w-[300px]'>Descripción</TableHead>
            <TableHead className="w-[150px]">
              <div className='flex items-center'>
                <CalendarIcon className="h-4 w-4 mr-2" />
                Fecha Inicio
              </div>
            </TableHead>
            <TableHead className="w-[100px]">
              <div className="flex items-center">
                <ClockIcon className="mr-2 h-4 w-4" />
                Horas
              </div>
            </TableHead>
            <TableHead className='w-[200px]'>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {proyectosConTotales.map((proyecto) => (
            <TableRow key={proyecto.id}>
              <TableCell className="font-medium">{proyecto.nombre}</TableCell>
              <TableCell className="text-gray-500">
                {proyecto.descripcion || 'Sin descripción'}
              </TableCell>
              <TableCell>
                {format(new Date(proyecto.fechaInicio), 'PPP', { locale: es })}
              </TableCell>
              <TableCell>{proyecto.horasTotales.toFixed(2)} horas</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="h-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-8"
                    onClick={() => handleDelete(proyecto.id)}
                    disabled={deletingId === proyecto.id}
                  >
                    {deletingId === proyecto.id ? (
                      <span className="animate-spin">↻</span>
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}