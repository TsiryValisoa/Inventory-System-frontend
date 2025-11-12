import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import CryptoJs from "crypto-js";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private static BASE_URL = 'http://localhost:5050/api';
  private static EBCRIPTION_KEY = "my-encryption-key";

  authStatusChanged = new EventEmitter<void>();

  constructor(private http: HttpClient) { }

  //Encrypt data and save to local storage
  encryptAndSaveToStorage(key : string, value : string) : void {
    const encryptedValue = CryptoJs.AES.encrypt(value, ApiService.EBCRIPTION_KEY).toString();
    localStorage.setItem(key, encryptedValue);
  }

  //Retreive from local storage and decrypt
  private getFromStorageAndDecrypt(key : string) : any {

    try {
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue) {
        return null;
      }
      return CryptoJs.AES.decrypt(encryptedValue, ApiService.EBCRIPTION_KEY).toString(CryptoJs.enc.Utf8);

    } catch (error) {
      return null;
    }
  }

  private cleanAuth() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }

  private getHeader() : HttpHeaders {

    const token = this.getFromStorageAndDecrypt("token");

    return new HttpHeaders({
      Authorization : 'Bearer ${token}'
    });
  }

  //User API
  registerUser(body : any) : Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/auth/register`, body);
  }

  loginUser(body : any) : Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/auth/login`, body);
  }

  getAllUser() : Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/users/all`,
      {
        headers : this.getHeader()
      }
    );
  }

  getLoggedInUserInfo() : Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/users/current`, {
      headers : this.getHeader()
    });
  }

  updateUser(id : string, body : any) : Observable<any> {
    return this.http.put(`${ApiService.BASE_URL}/users/update/${id}`,
      body,
      {
        headers : this.getHeader()
      }
    );
  }

  deleteUser(id : string) : Observable<any> {
    return this.http.delete(`${ApiService.BASE_URL}/users/delete/${id}`,
      {
        headers : this.getHeader()
      }
    );
  }

  listUserAndTransaction(id : string) : Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/users/transactions/${id}`,
      {
        headers : this.getHeader()
      }
    );
  }

  //Category API
  createCategory(body : any) : Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/categories/add`,
      body,
      {
        headers : this.getHeader()
      }
    );
  }

  listAllCategories() : Observable <any> {
    return this.http.get(`${ApiService.BASE_URL}/categories/all`,
      {
        headers : this.getHeader()
      }
  );
  }

  listCategoryById(id : string) : Observable <any> {
    return this.http.get(`${ApiService.BASE_URL}/categories/${id}`,
      {
        headers : this.getHeader()
      }
    );
  }

  updateCategory(id : string, body : any) : Observable<any> {
    return this.http.put(
      `${ApiService.BASE_URL}/categories/update/${id}`,
      body,
      {
        headers : this.getHeader()
      }
    );
  }

  deleteCategory(id : string) : Observable<any> {
    return this.http.delete(`${ApiService.BASE_URL}/categories/delete/${id}`, {
      headers : this.getHeader()
    });
  }

  //Supplier API
  addSupplier(body : any) : Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/suppliers/add`,
      body,
      {
        headers : this.getHeader()
      }
    );
  }

  listAllSuppliers() : Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/suppliers/all`,
      {
        headers : this.getHeader()
      }
    );
  }

  listSupplierById(id : string) : Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/suppliers/${id}`,
      {
        headers : this.getHeader()
      }
    );
  }

  updateSupplier(id : string, body : any) : Observable<any> {
    return this.http.put(`${ApiService.BASE_URL}/suppliers/update/${id}`,
      body,
      {
        headers : this.getHeader()
      }
    );
  }

  deleteSupplier(id : string) : Observable<any> {
    return this.http.delete(`${ApiService.BASE_URL}/suppliers/delete/${id}`,
      {
        headers : this.getHeader()
      }
    );
  }

  //Product API
  addProduct(formData : any) : Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/products/add`,
      formData,
      {
        headers : this.getHeader()
      }
    );
  } 

  listAllProducts() : Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/products/all`,
      {
        headers : this.getHeader()
      }
    );
  }

  listProductById(id : string) : Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/products/${id}`,
      {
        headers : this.getHeader()
      }
    );
  }

  updateProduct(id : string, formData : any) : Observable<any> {
    return this.http.put(`${ApiService.BASE_URL}/products/update/${id}`,
      formData,
      {
        headers : this.getHeader()
      }
    );
  }

  deleteProduct(id : string) : Observable<any> {
    return this.http.delete(`${ApiService.BASE_URL}/products/delete/${id}`,
      {
        headers : this.getHeader()
      }
    );
  }

  //Transaction API
  purchaseProduct(body : any) : Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/transactions/purchase`,
      body,
      {
        headers : this.getHeader()
      }
    );
  }

  sellProduct(body : any) : Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/transactions/sell`,
      body,
      {
        headers : this.getHeader()
      }
    );
  }

  returnProduct(body : any) : Observable<any> {
    return this.http.post(`${ApiService.BASE_URL}/transactions/return`,
      body,
      {
        headers : this.getHeader()
      }
    );
  }

  listAllTransactions(searchText : string) : Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/transactions/all`,
      {
        params: { searchText : searchText},
        headers : this.getHeader()
      }
    );
  }

  listTransactionById(id : string) : Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/transactions/${id}`,
      {
        headers : this.getHeader()
      }
    );
  }

  listByMonthAndYear(month : number, year : number) : Observable<any> {
    return this.http.get(`${ApiService.BASE_URL}/transactions/by-mont-year`,
      {
        headers : this.getHeader(),
        params : {
          month: month,
          year : year
        }
      }
    );
  }

  updateTransaction(id : string, transactionStatus : string) : Observable<any> {
    return this.http.put(`${ApiService.BASE_URL}/transactions/update/${id}`,
      JSON.stringify(transactionStatus),
      {
        headers : this.getHeader().set("Content-Type", "application/json")
      }
    );
  }

  //Authentcation checker
  logout() : void {
    this.cleanAuth();
  }

  isAuthenticated() : boolean {
    const token = this.getFromStorageAndDecrypt("token");
    return !!token;
  }

  isAdmin() : boolean {
    const role = this.getFromStorageAndDecrypt("role");
    return role === "ADMIN";
  }
}
