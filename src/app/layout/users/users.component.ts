import { Component, computed, signal, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../services/user.service';
import { HotToastService } from '@ngxpert/hot-toast';;
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import {
  MatDialog,
} from '@angular/material/dialog';
import { EditUserPopupComponent } from './edit-user-popup/edit-user-popup.component';
import { FormatDatePipe } from '../../pipes/format-date.pipe';

// import { PrimeIcons, MenuItem } from 'primeng/api';
// import { PopupComponent } from './popup/popup.component';

@Component({
  selector: 'app-users',
  imports: [TableModule, CommonModule, ButtonModule, FloatLabelModule, InputGroupAddonModule, InputGroupModule, FormsModule, FormatDatePipe],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {constructor(private userService: UserService, private toast: HotToastService,
    private cdr: ChangeDetectorRef, private dialog: MatDialog 
  ) {
    this.searchSubject.pipe(
      debounceTime(1000), // Wait 2s after the last event
      distinctUntilChanged() // Only emit if the value changes
    ).subscribe(searchTerm => {
      this.search(searchTerm);
      this.showSpinner.set(false);
    });
  }

  page = signal(1); // Current page number
  limit = signal(10); // Number of items per page
  users = signal<any[]>([]); // List of users (replace `any[]` with the actual type)
  first = signal(0); // Starting index
  last = signal(0);  // Ending index
  totalRecords = signal(0); // Total number of records
  totalPages = signal(10); // Total pages of records
  private searchSubject = new Subject<string>();
  searchText = ""
  showSpinner = signal(false)
  // Computed signal for payload
  payload = computed(() => ({
    page: this.page(),
    limit: this.limit(),
    status: undefined
  }));

  isLastPage = signal(false)
  isFirstPage = signal(true)
  currentPageReport = computed(() => {
    const start = this.first();
    const end = this.last();
    const total = this.totalRecords();
    return `Showing ${start} to ${end} of ${total} entries`;
  });
 
  userStats = signal({
    active: 0, total: 0, inactive: 0
  })

  userCards = computed(() =>([
    { title: "Total Users", icon: "pi pi-users", stat: this.userStats().total , button: undefined },
    { title: "Active Users", icon: "pi pi-user", stat: this.userStats().active, button: true},
    { title: "Deactivated Users", icon: "pi pi-ban", stat: this.userStats().inactive, button: false},
  ]))


  getRoleName(value: string) : string {
    return this.userService.getRoleName(value)
  }
  
  setStatusAndLoad(value: any){
    this.payload().status = value;
    this.getUsers();
  }
  
  openDialog(user:any): void {
    const dialogRef = this.dialog.open(EditUserPopupComponent, {
      data: user,
      width: '500px',
      

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result === "success") {
        location.reload()
      }
    });
  }

  paginationData = computed(() => {
    // const currentPage = this.page();

    // return [
    //   { pointer: currentPage - 2, value: currentPage - 2, current: false },
    //   { pointer: currentPage - 1, value: currentPage - 1, current: false },
    //   { pointer: currentPage, value: currentPage, current: true },
    //   { pointer: currentPage + 1, value: currentPage + 1, current: false },
    //   { pointer: currentPage + 2, value: currentPage + 2, current: false },
    // ]

    const currentPage = this.page();
  const totalPages = this.totalPages();

  // Determine the start and end of the range
  let start = Math.max(1, currentPage - 2); // Ensure the range never goes below 1
  let end = Math.min(totalPages, currentPage + 2); // Ensure the range never exceeds totalPages

  // Adjust range if near the beginning or the end
  if (currentPage <= 2) {
    end = Math.min(5, totalPages); // Show first 5 pages if at the start
  } else if (currentPage >= totalPages - 1) {
    start = Math.max(1, totalPages - 4); // Show last 5 pages if at the end
  }

  // Generate pagination data
  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push({
      pointer: i,
      value: i,
      current: i === currentPage,
    });
  }

  return pages;
  });

  pageOptions = [
    {value: 10},
    {value: 20},
    {value: 50},
    {value: 100},
    {value: 200},
    {value: 500},
    {value: 1000},

  ]
  
  


  onSearchChange(searchTerm: string) {
    this.showSpinner.set(true);
    this.searchSubject.next(searchTerm); // Emit new search term
  }


  checkCurrPage(state: boolean): string{
    return state ? "page" : "";
  }

  loadPage(page: number){
    if (page === 0) {
      this.toast.info("You have reached the first page!")  
    } else if (page > this.totalPages()){
      this.toast.info("You have reached the last page!")  
    } else if (page === this.page()){
      this.toast.info("You're already on page " + page)  
      
    } else {
      this.page.set(page)
      this.getUsers();
      this.cdr.markForCheck();
    }
      
  }
  
  
  onPageChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.limit.set( Number(selectedValue))
    this.page.set(1)
    this.searchText = ""
    this.getUsers();
  }

//   "totalPages": 4911,
//     "totalItems": 49106,
//     "currentPage": "1",
//     "hasNextPage": true,
//     "hasPrevPage": false,
//     "rangeStart": 1,
//     "rangeEnd": 10
// }
  getUsers(){
    console.log(this.payload())
    this.userService.getUsers(this.payload()).subscribe({
      next: (res:any) => {
        this.successAction(res);
        // console.log('user?', this.totalPages())
        // this.cdr.markForCheck()
      },
      error: (err:any) => {
        console.error('Error fetching users', err)
        this.toast.error(err.error.message );

      },
    });
  }
  
  getUserStats(){
    this.userService.getUserStats().subscribe({
      next: (res:any) => {
        this.userStats.set({
          active: res.activeUsers,
          inactive: res.inActiveUsers,
          total: res.totalUsers,
        });
        // this.successAction(res);
        console.log('user?', this.userStats())
        // this.cdr.markForCheck()
      },
      error: (err:any) => {
        console.error('Error fetching users stats', err)
        this.toast.error(err.error.message );

      },
    });
  }

  successAction(res: any){
    this.users.set(res.data)
        this.first.set(res.rangeStart)
        this.last.set(res.rangeEnd)
        this.isFirstPage.set(!res.hasPrevPage)
        this.isLastPage.set(!res.hasNextPage)
        this.totalRecords.set(res.totalItems)
        this.totalPages.set(res.totalPages)
        this.toast.success("users fetched from DB")
  }


  
  next() {
    this.page.update((currentPage) => currentPage + 1);
    this.getUsers()
  }
  
  prev() {
    this.page.update((currentPage) => Math.max(0, currentPage - 1));
    this.getUsers()
  }
  
  reset() {
    this.page.set(0);
  }
  
  pageChange(event: any) {
    const { first, rows, totalRecords } = event;
  this.first.set(first + 1); // First item is zero-indexed
  this.last.set(Math.min(first + rows, totalRecords)); // Calculate last item dynamically
  this.totalRecords.set(totalRecords); // Update total records
  }

  search(searchTerm: any){
    setTimeout(()=> {
      this.userService.searchUserByText(searchTerm, this.payload()).subscribe({
        next: (res:any) => {
          this.successAction(res);
  
        }, error: (err:any) => {
          
          console.error('Error fetching users', err)
          this.toast.error(err.error.message );

        }
    })
      
    }, 1000)
}
  
  
  
  ngOnInit() {
    // Subscribe to data and update the users signal
    this.getUsers()
    console.log(this.paginationData())
    this.getUserStats()
  }
}
