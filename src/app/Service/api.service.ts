import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import CryptoJs from "crypto-js";
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private static EBCRIPTION_KEY = "my-encryption-key";

  authStatusChanged = new EventEmitter<void>();

  constructor(private http: HttpClient) { }

  //Encrypt data and save to local storage
  encryptAndSaveToStorage(key: string, value: string) : void {
    const encryptedValue = CryptoJs.AES.encrypt(value, ApiService.EBCRIPTION_KEY).toString();
    localStorage.setItem(key, encryptedValue);
  }

  //Retreive from local storage and decrypt
  private getFromStorageAndDecrypt(key: string) : any {

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
      Authorization: `Bearer ${token}`
    });
  }

  //User API
  registerUser(body: any) : Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, body);
  }

  loginUser(body: any) : Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/login`, body);
  }

  getAllUser() : Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/all`,
      {
        headers: this.getHeader()
      }
    );
  }

  getLoggedInUserInfo() : Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/current`, {
      headers: this.getHeader()
    });
  }

  updateUser(id: string, body: any) : Observable<any> {
    return this.http.put(`${environment.apiUrl}/users/update/${id}`,
      body,
      {
        headers: this.getHeader()
      }
    );
  }

  deleteUser(id: string) : Observable<any> {
    return this.http.delete(`${environment.apiUrl}/users/delete/${id}`,
      {
        headers: this.getHeader()
      }
    );
  }

  listUserAndTransaction(id: string) : Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/transactions/${id}`,
      {
        headers: this.getHeader()
      }
    );
  }

  //Category API
  createCategory(body: any) : Observable<any> {
    return this.http.post(`${environment.apiUrl}/categories/add`,
      body,
      {
        headers: this.getHeader()
      }
    );
  }

  listAllCategories(search: string) : Observable <any> {
    return this.http.get(`${environment.apiUrl}/categories/all`,
      {
        params: {search},
        headers: this.getHeader()
      }
  );
  }

  listCategoryById(id: string) : Observable <any> {
    return this.http.get(`${environment.apiUrl}/categories/${id}`,
      {
        headers: this.getHeader()
      }
    );
  }

  updateCategory(id: string, body: any) : Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/categories/update/${id}`,
      body,
      {
        headers: this.getHeader()
      }
    );
  }

  deleteCategory(id: string) : Observable<any> {
    return this.http.delete(`${environment.apiUrl}/categories/delete/${id}`, {
      headers: this.getHeader()
    });
  }

  //Supplier API
  addSupplier(body: any) : Observable<any> {
    return this.http.post(`${environment.apiUrl}/suppliers/add`,
      body,
      {
        headers: this.getHeader()
      }
    );
  }

  listAllSuppliers(search: string) : Observable<any> {
    return this.http.get(`${environment.apiUrl}/suppliers/all`,
      {
        params: {search},
        headers: this.getHeader()
      }
    );
  }

  listSupplierById(id: string) : Observable<any> {
    return this.http.get(`${environment.apiUrl}/suppliers/${id}`,
      {
        headers: this.getHeader()
      }
    );
  }

  updateSupplier(id: string, body: any) : Observable<any> {
    return this.http.put(`${environment.apiUrl}/suppliers/update/${id}`,
      body,
      {
        headers: this.getHeader()
      }
    );
  }

  deleteSupplier(id: string) : Observable<any> {
    return this.http.delete(`${environment.apiUrl}/suppliers/delete/${id}`,
      {
        headers: this.getHeader()
      }
    );
  }

  //Product API
  addProduct(formData: any) : Observable<any> {
    return this.http.post(`${environment.apiUrl}/products/add`,
      formData,
      {
        headers: this.getHeader()
      }
    );
  } 

  listAllProducts(search: string, categoryId: number | null) : Observable<any> {
    let params = new HttpParams();

    if (search) {
        params = params.set('search', search);
    }

    if (categoryId) {
        params = params.set('categoryId', categoryId.toString());
    }

    return this.http.get(`${environment.apiUrl}/products/all`, {
      params: params,
      headers: this.getHeader()
    });
  }

  listProductById(id: string) : Observable<any> {
    return this.http.get(`${environment.apiUrl}/products/${id}`,
      {
        headers : this.getHeader()
      }
    );
  }

  updateProduct(id: string, formData: any) : Observable<any> {
    return this.http.put(`${environment.apiUrl}/products/update/${id}`,
      formData,
      {
        headers: this.getHeader()
      }
    );
  }

  deleteProduct(id: string) : Observable<any> {
    return this.http.delete(`${environment.apiUrl}/products/delete/${id}`,
      {
        headers: this.getHeader()
      }
    );
  }

  //Transaction API
  purchaseProduct(body: any) : Observable<any> {
    return this.http.post(`${environment.apiUrl}/transactions/purchase`,
      body,
      {
        headers: this.getHeader()
      }
    );
  }

  sellProduct(body: any) : Observable<any> {
    return this.http.post(`${environment.apiUrl}/transactions/sell`,
      body,
      {
        headers: this.getHeader()
      }
    );
  }

  returnProduct(body: any) : Observable<any> {
    return this.http.post(`${environment.apiUrl}/transactions/return`,
      body,
      {
        headers: this.getHeader()
      }
    );
  }

  listAllTransactions(page: number, size: number, searchText: string) : Observable<any> {
    return this.http.get(`${environment.apiUrl}/transactions/all`,
      {
        params: { page: page, searchText: searchText, size: size},
        headers : this.getHeader()
      }
    );
  }

  listTransactionById(id: string) : Observable<any> {
    return this.http.get(`${environment.apiUrl}/transactions/${id}`,
      {
        headers: this.getHeader()
      }
    );
  }

  listByMonthAndYear(month: number, year: number) : Observable<any> {
    return this.http.get(`${environment.apiUrl}/transactions/by-mont-year`,
      {
        headers: this.getHeader(),
        params: {
          month: month,
          year: year
        }
      }
    );
  }

  updateTransaction(id: string, transactionStatus: string) : Observable<any> {
    return this.http.put(`${environment.apiUrl}/transactions/update/${id}`,
      JSON.stringify(transactionStatus),
      {
        headers: this.getHeader().set("Content-Type", "application/json")
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
