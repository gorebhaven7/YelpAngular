import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {

  reservationTable:any;
  book:boolean = false;
  idTable:any;

  constructor() { }

  ngOnInit(): void {

    this.displayBookings();
  }

  displayBookings() {
    console.log("Booking Table");
    console.log(localStorage.getItem('reservations'));
    this.reservationTable = JSON.parse(localStorage.getItem('reservations') || "{}");
    if (this.reservationTable.length > 0) {
      this.book = true;
    }
    else{
      this.book = false;
    }
    console.log(this.reservationTable);
  }

  deleteBooking(id:any) {
    console.log(id);
    this.reservationTable = this.reservationTable.filter((item:any) => item.id !== id);
    localStorage.setItem('reservations', JSON.stringify(this.reservationTable));
    this.idTable = JSON.parse(localStorage.getItem('ids') || "{}");
    this.idTable = this.idTable.filter((item:any) => item !== id);
    localStorage.setItem('ids', JSON.stringify(this.idTable));
    this.displayBookings();
  }

}
