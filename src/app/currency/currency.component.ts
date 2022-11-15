import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { environment } from "../../environments/environment";

enum CurrenciesEnum {
  USD='USD',
  EUR='EUR',
  UAH='UAH',
  PLN='PLN',
  CAD='CAD'
}

enum InputsEnum {
FIRST='FIRST',
SECOND='SECOND'
}

interface ICurrencies{
  [CurrenciesEnum.USD]: number;
  [CurrenciesEnum.EUR]: number;
  [CurrenciesEnum.UAH]: number;
  [CurrenciesEnum.PLN]: number;
  [CurrenciesEnum.CAD]: number;
}

interface IInput{
  value: number;
  currency: keyof typeof CurrenciesEnum;
}

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css']
})

export class CurrencyComponent implements OnInit {
  currenciesByUAH: ICurrencies = {
    USD: 0,
    EUR: 0,
    UAH: 0,
    PLN: 0,
    CAD: 0
  };
  isSuccess :Boolean = false;
  firstInput : IInput = {value: 0, currency: CurrenciesEnum.USD};
  secondInput : IInput = {value: 0, currency: CurrenciesEnum.USD};

  CurrencyType = CurrenciesEnum;
  InputType = InputsEnum;
  Object = Object;

  constructor(private httpClient: HttpClient) {

  }

  ngOnInit(): void {
    this.getCurrencies()
  }

  getCurrencies(): void{
    this.httpClient.get<any>(environment.API_URL)
      .subscribe(response => {
        this.currenciesByUAH = response.rates as ICurrencies;
        this.isSuccess = true;
      });
  }

  changeInput(event: Event, inputs: string) : void{
    if(inputs===InputsEnum.FIRST){
      this.firstInput.value = Number((event.target as HTMLInputElement).value);
      this.calculate(InputsEnum.FIRST)
    }else {
        this.secondInput.value = Number((event.target as HTMLInputElement).value);
        this.calculate(InputsEnum.SECOND)
    }
  }

  changeSelect(select: string, inputs: string): void{
    if(inputs===InputsEnum.FIRST){
      this.firstInput.currency = select as keyof typeof CurrenciesEnum;
      this.calculate(inputs);
    }else {
      this.secondInput.currency = select as keyof typeof CurrenciesEnum;
      this.calculate(InputsEnum.SECOND);
    }
  }

  calculate(inputPosition: InputsEnum): void {
    let firstCurrency = this.currenciesByUAH[this.firstInput.currency];
    let secondCurrency = this.currenciesByUAH[this.secondInput.currency];
    if (inputPosition === InputsEnum.FIRST) {
      this.secondInput.value = Number((secondCurrency/firstCurrency*this.firstInput.value).toFixed(2));
    }else{
      this.firstInput.value = Number((firstCurrency/secondCurrency*this.secondInput.value).toFixed(2));
    }
  }
}
