import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, NgForm,  ValidationErrors, NgModel, Validators, FormBuilder } from '@angular/forms';
import { min } from 'rxjs';
import { AppServiceService } from './app-service.service';


declare var window:any;
declare var $: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  filteredOptions: any[] = [];
  key :string = '';
  loc:string = '';
  dist:string = '';
  cat:string = '';
  lat: string = '';
  long: string = '';
  ydata:any = false; 
  checkydata:boolean = false;
  cardData:any = false;
  cate:any="";
  images:any = [];
  firstimage:any = '';
  restimages:any = [];
  mapOptions:any;
  reviewId:any;
  reviews:any;
  time:any;
  reserveForm!: FormGroup;
  submitted = false;
  selectedCategory: string = 'all';
  month:any;
  day:any;
  year:any;
  reserved:boolean = true;
  reservationIds:any = [];
  tablevisible:boolean = true;
  reservationTable:any;
  Ids:any = [];
  reserModal: any;
  checkbox:boolean = false;
  loading = false;
  
 

  selectedCategoryChangeHandler (event: any) {
    this.selectedCategory = event.target.value;
    // console.log(this.selectedCategory);
  }


  constructor(private service: AppServiceService, private formBuilder: FormBuilder) { 
   }

  ngOnInit():void {

    this.reserModal = new window.bootstrap.Modal(document.getElementById('exampleModal'));

    this.reserveForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      date: ['', Validators.required],
      hour: ['', Validators.required],
      minute: ['', Validators.required]
    });

    var today = new Date();
    
    this.month = today.getMonth()+1;
    this.day = today.getDate();
    this.year = today.getFullYear();
    console.log(this.month, this.day, this.year);
    if(this.month < 10){
      this.month = '0'+this.month.toString();
    }
    if(this.day < 10){
      this.day = '0'+this.day.toString();
    }
    var maxDate = this.year+'-'+this.month+'-'+this.day;
    let d = document.getElementById('date') as HTMLInputElement;
    d.setAttribute('min', maxDate);

    }

  onInputChange(){
    let k = document.getElementById('typeKeyword') as HTMLInputElement;
    // console.log(k.value);
    if(k.value.length >= 1){
      this.loading=true;
      // console.log(typeof(k.value));
      this.service.getAutoComplete(k.value).subscribe((data:any) => {
        // console.log(data);
        this.filteredOptions = data.terms.map((item:any) => item.text);
        // console.log(this.filteredOptions); 
        this.loading=false;
        for(let i of data.categories){
          this.filteredOptions.push(i.title);
        }
      })
    }
  }

  fetchYelpData(){
    // console.log('fetching data');
    // console.log(this.key, this.lat, this.long, this.dist, this.selectedCategory);
    this.service.secondTableData(this.key, this.lat, this.long, this.dist, this.selectedCategory).subscribe((data:any) => {
      this.ydata = data.businesses;
      console.log(this.ydata);
      if(this.ydata.length > 0){
        this.checkydata = true;
      }
      else{
        this.checkydata = false;
      }
      console.log(this.checkydata);
    });

  }

  submit(bussForm:any){ 
    // console.log('Submitted');
    
    this.key = bussForm.value.key;
    if(bussForm.value.distance == '' || bussForm.value.distance == null){
      this.dist = "10";
      bussForm.value.distance = 10;
    }
    else{
      this.dist = bussForm.value.distance;
    }
    if(bussForm.value.check){
      this.service.getIP().subscribe((data:any) => {
        // console.log(data);
        this.lat = data.loc.split(',')[0];
        this.long = data.loc.split(',')[1];
        console.log(this.lat);
        console.log(this.long);
        this.fetchYelpData();
        })
    }
    else{
      this.loc = bussForm.value.location;
      // console.log(this.loc);
      this.service.getLocation(this.loc).subscribe((data:any) => {
        // console.log(data);
        this.lat = data.results[0].geometry.location.lat;
        this.long = data.results[0].geometry.location.lng;
        console.log(this.lat);
        console.log(this.long);
        this.fetchYelpData();
      });
      
  }
  // console.log(bussForm.value);
  }

  get_card_data(id:any){
    console.log(id);
    this.reviewId = id;
    this.service.getCardData(id).subscribe((data:any) => {
      this.cardData = data;
      this.cate = data.categories.map((a:any)=>a.title).join(' | ');
      this.images = data.photos;
      const index = this.images.indexOf(this.images[0]);
      this.firstimage = this.images[0];
      if (index > -1) {
        this.images.splice(index, 1);
      }
      this.restimages = this.images;
      // console.log(this.images);
      console.log(data);
      // console.log(this.cate);

      this.mapOptions = {
        center: { lat: data.coordinates.latitude, lng: data.coordinates.longitude },
        zoom: 14
      };

      if(localStorage.getItem('reservations') == null){
        localStorage.setItem('reservations', JSON.stringify([]));
      }
      if(localStorage.getItem('ids')==null){
        localStorage.setItem('ids', JSON.stringify([]));
      }
      this.reservationIds = JSON.parse(localStorage.getItem('ids')!);
      console.log(this.reservationIds);
        console.log(this.reservationIds);
        console.log(this.reservationIds.includes(this.cardData.id));
        
        
        if(this.reservationIds.includes(this.cardData.id)){
          this.reserved = true;
        }
        else{
          this.reserved = false;
        }
        
      this.tablevisible = false;
  });

  this.service.getReviews(id).subscribe((data:any) => {
    // console.log(data);
    this.reviews = data.reviews.slice(0,Math.min(3,data.reviews.length));
    console.log(this.reviews[0].time_created);
    // this.time = data.reviews.time_created.split(' ')[0];
    console.log(this.reviews);
  });

}
onReserve(){
  this.submitted = true;
  if(this.reserveForm.invalid){
    return;
  }
  console.log(this.submitted);
  // alert("Success");
  console.log(this.reserveForm.value);
  alert("Reservation Successful");
  // $('#exampleModal').modal('hide')
  // let v = document.getElementById('.modal.in') as HTMLInputElement;
  // v.modal('hide');
  // $('.modal.in').modal('hide');
  // this.reserModal.hide();

  
  // const modal = new window.bootstrap.Modal(container);
  // modal.hide();

  this.reserveForm.value['id'] = this.cardData.id;
  this.reserveForm.value['name'] = this.cardData.name;
 
  // let val = document.getElementById('modalsubmit') as HTMLInputElement;
  // console.log(val);
  // val.click();
  // val.setAttribute('data-dismiss', 'modal');

  // const container = document.getElementById("exampleModal");
  // container.close()
  // this.modalService.dismissAll();

  // $('#exampleModal .close').click();
  $('#exampleModal').modal('hide');

  this.storage(this.reserveForm.value);
  // this.reserved = false;
  this.get_card_data(this.cardData.id);
  


}



storage(val:any){

  if(typeof(Storage)!="undefined"){
    console.log("Local Storage is supported");
    console.log(val);

    if(localStorage.getItem('reservations') == null){
      localStorage.setItem('reservations', JSON.stringify([]));
    }
    if(localStorage.getItem('ids')==null){
      localStorage.setItem('ids', JSON.stringify([]));
    }
    let reservations = JSON.parse(localStorage.getItem('reservations') || '{}');
    let ids = JSON.parse(localStorage.getItem('ids') || '{}');
    ids.push(this.cardData.id);
    localStorage.setItem('ids', JSON.stringify(ids));
    reservations.push(val);
    localStorage.setItem('reservations', JSON.stringify(reservations));
    console.log(reservations);
    this.reservationIds = JSON.parse(localStorage.getItem('ids') || "{}");
    console.log(this.reservationIds);
    this.reservationTable = JSON.parse(localStorage.getItem('reservations') || "{}");

  }
  else{
    alert("Sorry, your browser does not support Web Storage...");
  }

}

back(){
  this.tablevisible = true;
}
deleteBooking(id:any) {
  console.log(id);
  console.log(this.reservationTable);
  this.reservationTable = JSON.parse(localStorage.getItem('reservations') || "{}");
  this.reservationTable = this.reservationTable.filter((item:any) => item.id !== id);
  localStorage.setItem('reservations', JSON.stringify(this.reservationTable));
  
  // this.reservationIds = this.reservationIds.filter((item:any) => item !== id);

  this.Ids = this.Ids.filter((item:any) => item !== id);
  localStorage.setItem('ids', JSON.stringify(this.Ids));
  this.get_card_data(this.cardData.id);
}

checkboxchanged(){
  if(this.checkbox){
    this.checkbox = false;
  }
  else{
    this.checkbox = true;
  }
  console.log(this.checkbox);
}
clearr(bussForm:any)
{
  console.log("clear")
  this.checkbox = false;
  this.ydata = [];
}
getFacebookShareUrl(item:any) {
  const productName = encodeURIComponent(item.Title);
  const price = encodeURIComponent(item.CurrentPrice.Value);
  const link = encodeURIComponent(item.viewItemURLForNaturalSearch);
  const baseShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${link}&display=popup`;

  // Now use baseShareUrl as the href in your anchor tag
  return baseShareUrl;
}
}


