"use strict"

const D = class extends Date {
    getDayName() {
        const dayNames = [
            "Sun",
            "Mon",
            "Tues",
            "Wednes",
            "Thurs",
            "Fri",
            "Sat",
        ]
        return dayNames[this.getDay()]
    }
    getMonthName() {
        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ]
        return monthNames[this.getMonth()]
    }
    mmmddyyyy() {
        const mmm = this.getMonthName().slice(0, 3)
        const dd = this.getDate().toString().padStart(2, "0")
        const yyyy = this.getFullYear().toString().padStart(4, "0")
        return `${mmm} ${dd}, ${yyyy}`
    }
    yyyymmdd() {
        const yyyy = this.getFullYear().toString().padStart(4, "0")
        const mm = (this.getMonth() + 1).toString().padStart(2, "0")
        const dd = this.getDate().toString().padStart(2, "0")
        return yyyy + mm + dd
    }
}
module.exports = D
