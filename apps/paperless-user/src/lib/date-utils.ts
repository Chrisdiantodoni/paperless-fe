export function parseISODate(isoString: string): Date {
  return new Date(isoString)
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}

export function calculateWorkdays(
  startDateISO: string,
  endDateISO: string
): number {
  if (!startDateISO || !endDateISO) {
    return 0
  }

  try {
    const start = parseISODate(startDateISO)
    const end = parseISODate(endDateISO)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 0
    }

    if (end < start) {
      return 0
    }

    let workdays = 0
    const current = new Date(start)

    while (current <= end) {
      if (!isWeekend(current)) {
        workdays++
      }
      current.setDate(current.getDate() + 1)
    }

    return workdays
  } catch (error) {
    console.error("Error calculating workdays:", error)
    return 0
  }
}

export function formatDateRange(
  startDateISO: string,
  endDateISO: string
): string {
  if (!startDateISO || !endDateISO) {
    return "-"
  }

  try {
    const start = parseISODate(startDateISO)
    const end = parseISODate(endDateISO)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return "-"
    }

    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    }

    const formatter = new Intl.DateTimeFormat("id-ID", options)
    return `${formatter.format(start)} - ${formatter.format(end)}`
  } catch (error) {
    return "-"
  }
}

export function formatSingleDate(dateISO: string): string {
  if (!dateISO) {
    return "-"
  }

  try {
    const date = parseISODate(dateISO)
    if (isNaN(date.getTime())) {
      return "-"
    }

    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    }

    return new Intl.DateTimeFormat("id-ID", options).format(date)
  } catch (error) {
    return "-"
  }
}

export function formatTime(timeString: string): string {
  if (!timeString) {
    return "-"
  }

  if (/^\d{2}:\d{2}(:\d{2})?$/.test(timeString)) {
    return timeString.slice(0, 5)
  }

  return timeString
}
