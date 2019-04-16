import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'wordLimit' })
export class  WordLimitPipe implements PipeTransform {
  transform(value: string,len:number=33): string {
    return  value===undefined||value===null||value===''?'未填写':value.length<len?value:value.substring(0,len)+'...'
  }
}

@Pipe({ name: 'showDetaiOrOn' })
export class  ShowDetailPipe implements PipeTransform {
  transform(value: string,len:number=33): string {
    return  value&&value.length<len?'':value
  }
}
