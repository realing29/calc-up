import { makeAutoObservable } from "mobx";
import { annualInflationList } from "./inflation.json";
import { calculateInflation } from "./calculateInflation";

type rowYearInflation = (typeof annualInflationList)[number];

type RowType = rowYearInflation & {
  salary?: NumberString;
  placeholder?: NumberString;
  ratio?: NumberString;
};

class Store {
  constructor(public rows: RowType[]) {
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  lastSalary?: number;
  tempRate?: number;
  calculateRatio() {
    this.rows.map((row) => {
      if (this.lastSalary && row.salary) {
        row.ratio = this.lastSalary / (this.tempRate! * +row.salary);
      } else if (row.salary && !this.lastSalary) {
        this.lastSalary = +row.salary;
        this.tempRate = row.rate / 100 + 1;
      } else if (row.salary === "") {
        row.ratio = "";
      }

      if (this.tempRate) {
        const addRate = row.rate / 100 + 1;
        this.tempRate *= addRate;
      }
    });
    this.lastSalary = undefined;
    this.tempRate = undefined;
  }

  setSalary(index: number, salary: NumberString) {
    const currentRow = this.rows[index];
    this.salaryTemp = +salary;

    if (this.salaryTemp === 0) {
      currentRow.placeholder = "";
      currentRow.salary = "";
    } else {
      currentRow.salary = salary;
    }

    for (let i = index; ++i < this.rows.length; ) {
      this.calculateRow(i, "-");
    }

    this.salaryTemp = +salary;

    for (let i = index; --i >= 0; ) {
      this.calculateRow(i, "+");
    }

    this.calculateRatio();
  }

  salaryTemp: NumberString = 0;

  calculateRow(i: number, operator: "-" | "+") {
    const iterateRow = this.rows[i];
    const { rate } = operator === "-" ? this.rows[i - 1] : iterateRow;

    const salaryInflated = calculateInflation(this.salaryTemp, rate, operator);
    iterateRow.placeholder = salaryInflated;
    this.salaryTemp = salaryInflated;
  }
}

export default new Store(annualInflationList);
