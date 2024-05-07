function add(a: number, b: number) {
  return a + b;
}
function subtract(a: number, b: number) {
  return a - b;
}

const operations = {
  "+": add,
  "-": subtract,
};

export function calculateInflation(salary: NumberString, rate: number, operation: "+" | "-"): NumberString {
  if (operation === "+") {
    const percentSalary = +salary * (rate / 100);
    return operations[operation](+salary, +percentSalary) || "";
  } else {
    return +salary / (rate / 100 + 1);
  }
}
