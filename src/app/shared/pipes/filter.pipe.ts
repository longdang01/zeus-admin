/*
2022-04-04 To filter tables with a search string
*/
import {
  Pipe,
  PipeTransform
} from '@angular/core';
@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(list: any[], filters: any) {
    // console.log('FilterTablePipe ' + value);
    // let us return only items that contain the value string, regardless of case
    // return filters ?
    //   list.filter((item) => {
    //     // console.log(JSON.stringify(value.title))
    //     console.log(JSON.stringify(item[filters.title]).toLowerCase())
    //     console.log(filters["text"].toLowerCase())
    //     return JSON.stringify(item[filters.title]).toLowerCase().includes(filters.text.toLowerCase())
    //   }
    //   ) :
    //   list;
    const keys       = Object.keys(filters).filter(key => filters[key]);
    const condition = (item: any) => keys.every(key => { 
      if(key == 'orderDate' || key == 'datePost') return item[key].slice(0, 10) === filters[key].slice(0, 10)
      else if(key == 'status') return Number(item[key]) === Number(filters[key])
      else if(key == 'deliveryAddress') return item[key].customer.customerName.toLowerCase().includes(filters[key].toLowerCase())
      else return item[key].toLowerCase().includes(filters[key].toLowerCase())
      
    });

    return keys.length ? list.filter(condition) : list;
  }
}