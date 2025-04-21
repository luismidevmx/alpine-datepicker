const { DateTime } = luxon

function createDatepicker({
  months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' '),
  weekdays = 'Sun Mon Tue Wed Thu Fri Sat'.split(' '),
  yearStart = 2016,
  yearEnd = 2026,
  years = null,
  hourStart = 7,
  hourEnd = 22,
  hourStep = 0.5,
  dateFormat = 'yyyy-MM-dd hh:mm:ss' //
} = {}) {
  const dt = DateTime.local()
  const timeZone = dt.zoneName

  const luxonDate = DateTime.now({ zone: timeZone })

  const { day: selectedDay, month: selectedMonth, year: selectedYear, hour: selectedHour, minute: selectedMinute } = luxonDate.toObject()

  return {
    months,
    weekdays,
    // /*REDEFINED*/ days: Array.from({ length: 31 }, (_, i) => i + 1),
    years: years ?? Array.from({ length: yearEnd - yearStart }, (_, i) => i + yearStart) ?? [2024, 2025, 2026],
    hours: Array.from({ length: (hourEnd - hourStart) / hourStep }, (_, i) => hourStart + i * hourStep),
    timeZone,

    selectedDay,
    selectedMonth,
    selectedYear,
    selectedHour,
    selectedMinute,

    get luxonDay1() {
      return this.luxonSelectedDate.startOf('month')
    },

    get luxonDay31() {
      return this.luxonSelectedDate.endOf('month')
    },

    get daysShift() {
      return Array.from({ length: this.luxonDay1.weekday % 7 }, (_, i) => i)
    },

    get days() {
      return Array.from({ length: this.luxonDay31.day }, (_, i) => i + 1)
    },

    get smartDays() {
      return this.days.map(day => ({
        label: day,
        selected: day === selectedDay
      }))
    },

    get smartMonths() {
      return this.months.map((month, i) => ({
        label: month,
        selected: month === selectedMonth,
        value: i + 1
      }))
    },

    get smartYears() {
      return this.years.map(year => ({
        label: year,
        selected: year === selectedYear
      }))
    },

    get selectedTime() {
      return this.luxonSelectedDate.toFormat('HH:mm')
    },

    get luxonSelectedDate() {
      return DateTime.fromObject({
        day: this.selectedDay,
        month: this.selectedMonth,
        year: this.selectedYear,
        hour: Math.floor(this.selectedHour),
        minute: Math.floor((this.selectedHour % 1) * 60)
      })
    },

    get humanSelectedDate() {
      return this.luxonSelectedDate.toFormat('ff')
    },

    get localDateValue() {
      return this.luxonSelectedDate.toFormat(dateFormat)
    },

    get utcDateValue() {
      return this.luxonSelectedDate.toUTC().toFormat(dateFormat)
    }
  }
}
