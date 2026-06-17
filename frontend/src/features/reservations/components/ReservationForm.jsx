import React, { useState } from 'react'
import Button from '../../../shared/components/Button.jsx'
import ErrorMessage from '../../../shared/components/ErrorMessage.jsx'
import { useAuth } from '../../../shared/hooks/useAuth.js'

export default function ReservationForm({ resource, onSubmit, orgSettings }) {
  const { activeOrg } = useAuth()
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [error, setError] = useState('')

  const labelSingular = activeOrg?.resource_label_singular || resource?.resource_label_singular || 'Recurso'

  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const orgTimezone = orgSettings?.timezone || 'UTC'
  const hasTimezoneMismatch = localTimezone !== orgTimezone

  // Helpers de conversión de tiempo
  const timeToMinutes = (t) => {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
  }

  const cleanTime = (t) => (t ? t.substring(0, 5) : '')

  const getOrgDateParts = (timezone) => {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
      const parts = formatter.formatToParts(new Date())
      const val = {}
      parts.forEach(p => { val[p.type] = p.value })
      return {
        dateStr: `${val.year}-${val.month}-${val.day}`,
        timeStr: `${val.hour}:${val.minute}`
      }
    } catch (e) {
      const now = new Date()
      const pad = (n) => String(n).padStart(2, '0')
      return {
        dateStr: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
        timeStr: `${pad(now.getHours())}:${pad(now.getMinutes())}`
      }
    }
  }

  const getOrgLimitDateStr = (timezone, maxDays) => {
    const limitDate = new Date(new Date().getTime() + maxDays * 24 * 60 * 60 * 1000)
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour12: false
      })
      const parts = formatter.formatToParts(limitDate)
      const val = {}
      parts.forEach(p => { val[p.type] = p.value })
      return `${val.year}-${val.month}-${val.day}`
    } catch (e) {
      const pad = (n) => String(n).padStart(2, '0')
      return `${limitDate.getFullYear()}-${pad(limitDate.getMonth() + 1)}-${pad(limitDate.getDate())}`
    }
  }

  // Validación en caliente de reglas de negocio
  const getValidationError = () => {
    if (!date || !startTime || !endTime) {
      return null
    }

    const orgNow = getOrgDateParts(orgTimezone)

    // 1. Reservas en el pasado (RN-003)
    if (date < orgNow.dateStr) {
      return 'No se pueden realizar reservas en fechas pasadas.'
    }
    if (date === orgNow.dateStr && startTime < orgNow.timeStr) {
      return 'No se pueden realizar reservas en horarios pasados.'
    }

    // 2. Validación de Horarios (RN-002)
    const startMin = timeToMinutes(startTime)
    const endMin = timeToMinutes(endTime)
    if (startMin >= endMin) {
      return 'La hora de fin debe ser estrictamente posterior a la hora de inicio.'
    }

    // 3. Duración máxima permitida (RN-010)
    if (orgSettings?.max_duration_minutes) {
      const duration = endMin - startMin
      if (duration > orgSettings.max_duration_minutes) {
        return `La duración de la reserva (${duration} min) supera el máximo de ${orgSettings.max_duration_minutes} min permitido.`
      }
    }

    // 4. Horarios permitidos de la organización (RN-010)
    if (orgSettings?.allowed_start_time) {
      const allowedStart = cleanTime(orgSettings.allowed_start_time)
      if (startTime < allowedStart) {
        return `El horario de inicio permitido por la organización es a partir de las ${allowedStart}.`
      }
    }
    if (orgSettings?.allowed_end_time) {
      const allowedEnd = cleanTime(orgSettings.allowed_end_time)
      if (endTime > allowedEnd) {
        return `El horario de fin permitido por la organización es hasta las ${allowedEnd}.`
      }
    }

    // 5. Días máximos de anticipación (RN-010)
    if (orgSettings?.max_days_ahead) {
      const limitDateStr = getOrgLimitDateStr(orgTimezone, orgSettings.max_days_ahead)
      if (date > limitDateStr) {
        return `Solo se permiten reservas con un máximo de ${orgSettings.max_days_ahead} días de anticipación (hasta el ${limitDateStr}).`
      }
    }

    return null
  }

  const validationError = getValidationError()
  const hasFormFilled = date && startTime && endTime
  const isSubmitDisabled = !hasFormFilled || !!validationError

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')
    onSubmit({ date, startTime, endTime })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="font-bold text-slate-800 text-lg mb-2">
        Reservar {labelSingular}: {resource?.name || 'Recurso'}
      </h3>

      {/* Alerta de discrepancia de huso horario */}
      {hasTimezoneMismatch && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-xs flex gap-3 items-start">
          <svg className="w-5 h-5 flex-shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <span className="font-semibold block mb-0.5">Diferencia de zona horaria</span>
            <span>
              Tu dispositivo está en <strong>{localTimezone}</strong>, pero esta organización opera en <strong>{orgTimezone}</strong>. Las horas seleccionadas corresponden a la zona de la organización.
            </span>
          </div>
        </div>
      )}

      {/* Mensajes de error en caliente y del backend */}
      <ErrorMessage message={validationError || error} />

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
        <input 
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={`w-full px-4 py-2.5 bg-white border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
            validationError && date ? 'border-red-300 focus:ring-red-500' : 'border-slate-200'
          }`}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Hora Inicio</label>
          <input 
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className={`w-full px-4 py-2.5 bg-white border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
              validationError && startTime ? 'border-red-300 focus:ring-red-500' : 'border-slate-200'
            }`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Hora Fin</label>
          <input 
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className={`w-full px-4 py-2.5 bg-white border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition ${
              validationError && endTime ? 'border-red-300 focus:ring-red-500' : 'border-slate-200'
            }`}
          />
        </div>
      </div>

      <Button type="submit" variant="primary" className="w-full" disabled={isSubmitDisabled}>
        Confirmar Reserva
      </Button>
    </form>
  )
}
