import { observer } from "mobx-react-lite";
import "./App.css";
import store from "./store";
import style from "./style.module.scss";

function toNumberStrOrVoidStr(any: any, fix: number = 2): string {
  return any && +any ? (fix ? any.toFixed(fix) : any) : "";
}

function App() {
  return (
    <>
      <h1>Прога позволяет увидеть во сколько раз ты вырос по ЗП с учетом инфляции</h1>
      <table className={style.table}>
        <thead>
          <tr>
            <th>Год</th>
            <th>Инфляция %</th>
            <th>ЗП</th>
            <th>Соотношение</th>
          </tr>
        </thead>
        <tbody>
          {store.rows.map(({ rate, year, salary, placeholder, ratio }, index) => (
            <tr key={index}>
              <td>{year}</td>
              <td>{rate.toFixed(2)}</td>
              <td>
                <input
                  type="number"
                  value={toNumberStrOrVoidStr(salary, 0)}
                  placeholder={toNumberStrOrVoidStr(placeholder)}
                  onChange={({ target }) => store.setSalary(index, +target.value)}
                />
              </td>
              <th>{toNumberStrOrVoidStr(ratio)}</th>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default observer(App);
