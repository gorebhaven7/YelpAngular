import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {catchError, map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {


  constructor(private http: HttpClient) { }

  // API_key = "AIzaSyB1BIyHCc2MXq8Io2aUCk9klwKabaOpyYg";

  getAutoComplete(Keyword:string): Observable<any>{
    const url = 'http://localhost:8080/getautocomplete';
    // const url = 'https://backend-368000.uc.r.appspot.com/getautocomplete';

    let params = {
      Keyword: Keyword
    };
    let queryParams = new HttpParams({fromObject: params});
    return this.http.get<any>(url, {params: queryParams})
    .pipe(
      map((data:any) => {
        return data;
      }),
      catchError((error:any) => {
        // console.log(error);
        return error;
      })
    )
  }

  getLocation(Location:String):Observable<any>{
    let url = "https://maps.googleapis.com/maps/api/geocode/json?address="+Location+"&key=AIzaSyDIf0VgJ8BL0l5uoQlNvTbanhdXfoMGKQM";
    return this.http.get<any>(url).pipe(
      map((data:any) => {
        return data;
      }),
      catchError((error:any) => {
        // console.log(error);
        return error;
      })); 
  }

  getIP():Observable<any>{
    let url = "https://ipinfo.io?token=d7bdd983979acd";
    return this.http.get<any>(url).pipe(
      map((data:any) => {
        return data;
      }),
      catchError((error:any) => {
        // console.log(error);
        return error;
      }));
    }

  secondTableData(Keyword:string, Latitude:string, Longitude:string, Distance:string, Category:string):Observable<any>{
    const url = 'http://localhost:8080/fetchsecondtabledata';
    // const url = 'https://backend-368000.uc.r.appspot.com/fetchsecondtabledata';

    let params = {
      term: Keyword,
      latitude: Latitude,
      longitude: Longitude,
      categories: Category,
      radius: Distance
    };
    console.log(params);
    let queryParams = new HttpParams({fromObject: params});
    return this.http.get<any>(url, {params: queryParams}).pipe(
      map((data:any) => {
        console.log(data.businesses);
        return data;
      }),
      catchError((error:any) => {
        // console.log(error);
        return error;
      }));
    }

    getCardData(id:string):Observable<any>{
      const url = 'http://localhost:8080/getcarddata';
      // const url = 'https://backend-368000.uc.r.appspot.com/getcarddata';

      let params = {
        id: id
      };

      let queryParams = new HttpParams({fromObject: params});
      return this.http.get<any>(url, {params: queryParams}).pipe(
        map((data:any) => {
          // console.log(data);
          return data;
        }),
        catchError((error:any) => {
          // console.log(error);
          return error;
        }));
    }

    getReviews(id:string):Observable<any>{
      const url = 'http://localhost:8080/getreviews';
      // const url = 'https://backend-368000.uc.r.appspot.com/getreviews';

      let params = {
        id: id
      };

      let queryParams = new HttpParams({fromObject: params});
      return this.http.get<any>(url, {params: queryParams}).pipe(
        map((data:any) => {
          // console.log(data);
          return data;
        }),
        catchError((error:any) => {
          // console.log(error);
          return error;
        }));
    }
}
