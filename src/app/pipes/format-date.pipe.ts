import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {
//   transform(value: string): string {
//     if (!value) {
//       return '';
//     }

//     try {
//       const date = new Date(value);

//       // Format the date components
//       const year = date.getFullYear();
//       const month = date.toLocaleString('default', { month: 'short' }); // Months are 0-indexed
//       const day = String(date.getDate()).padStart(2, '0');

//       // Format the time components
//       const hours = String(date.getHours()).padStart(2, '0');
//       const minutes = String(date.getMinutes()).padStart(2, '0');
//       const seconds = String(date.getSeconds()).padStart(2, '0');

//       return `${year}-${month}-${day}, ${hours}-${minutes}-${seconds}`;
//     } catch (error) {
//       console.error('Invalid date format:', value);
//       return '';
//     }
//   }
// }

  transform(value: string | Date): string {
    if (!value) return '';

    // Parse the input date
    const date = new Date(value);

    // Format the day with ordinal suffix
    const day = date.getDate();
    const ordinal = this.getOrdinalSuffix(day);

    // Get month, year, and time parts
    const month = date.toLocaleString('default', { month: 'short' }); // 'Jan', 'Feb', etc.
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const amPm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12; // Convert to 12-hour format

    // Combine into the desired format
    return `${day}${ordinal} ${month}, ${year}; ${hours}:${minutes} ${amPm}`;
  }

  // Helper method to get ordinal suffix
  private getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return 'th'; // Covers 11th to 20th
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }
}
