import { Component, createMemo, JSX } from "solid-js";

type TableColumn = {
  title: string;
  values: any[];
};

export type TableProps = {
  columns: TableColumn[];
  actions?: {
    icon: JSX.Element;
    handler: (row: any) => void;
  }[];
};

const Table: Component<TableProps> = (props) => {
  const titles = createMemo(() => {
    const titles = [];
    props.columns.forEach((column) => {
      titles.push(<th>{column.title}</th>);
      if (props.actions) {
        props.actions.forEach(() => titles.push(<th>&nbsp;</th>));
      }
    });
    return titles;
  });

  const rows = createMemo(() => {
    const rows = [];
    props.columns[0].values.forEach((_x, idx) => {
      const row = [];
      const rowValues = [];
      props.columns.forEach((column) => {
        const val = column.values[idx];

        rowValues.push(val);
        row.push(
          <td>
            <div class="my-2">{val}</div>
          </td>
        );

        if (props.actions) {
          props.actions.forEach((action) =>
            row.push(
              <td>
                <button
                  class="button"
                  onClick={() => action.handler(rowValues)}
                >
                  <span class="icon is-small">{action.icon}</span>
                </button>
              </td>
            )
          );
        }
        rows.push(<tr>{row}</tr>);
      });
    });

    return rows;
  });

  return (
    <table class="table is-hoverable">
      <thead>
        <tr>{titles()}</tr>
      </thead>
      <tbody>{rows()}</tbody>
    </table>
  );
};

export default Table;
