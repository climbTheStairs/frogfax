/**
 * Copyright (C) 2020, 2021 climbTheStairs
 *
 * This file is part of frogfax.
 * 
 * frogfax is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * frogfax is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public
 * License along with frogfax. If not, see
 * <https://www.gnu.org/licenses/>.
 */

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
