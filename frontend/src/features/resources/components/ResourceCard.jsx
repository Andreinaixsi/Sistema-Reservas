import React from 'react'
import { Link } from 'react-router-dom'
import { Users } from 'lucide-react'

export default function ResourceCard({ resource }) {
  const { id, name, description, capacity } = resource

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all p-6 flex flex-col justify-between">
      <div>
        <h4 className="font-bold text-slate-800 text-lg mb-1">{name}</h4>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2">{description || 'Sin descripción disponible.'}</p>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="flex items-center gap-1.5 text-slate-600 text-xs font-semibold bg-slate-100 px-2.5 py-1.5 rounded-lg">
          <Users className="w-3.5 h-3.5" />
          Capacidad: {capacity || 'Ilimitada'}
        </span>
        <Link 
          to={`/resources/${id}`} 
          className="text-primary-600 hover:text-primary-700 font-semibold text-sm transition"
        >
          Reservar &rarr;
        </Link>
      </div>
    </div>
  )
}
