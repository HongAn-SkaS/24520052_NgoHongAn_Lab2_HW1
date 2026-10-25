
import { validateDataGridProps } from "./data-grid-contract.js";

const employeeData = [
    {
        id: "EMP-001",
        name: "Alex Morgan",
        department: "IT Support",
        status: "Active"
    },
    {
        id: "EMP-002",
        name: "Jamie Lee",
        department: "Infrastructure",
        status: "Active"
    },
    {
        id: "EMP-003",
        name: "Taylor Smith",
        department: "Security",
        status: "Inactive"
    },
    {
        id: "EMP-004",
        name: "Jordan Kim",
        department: "IT Support",
        status: "Active"
    },
    {
        id: "EMP-005",
        name: "Casey Nguyen",
        department: "Infrastructure",
        status: "Inactive"
    }
];

const employeeColumns = [
    {
        header: "Employee ID",
        accessorKey: "id",
        sortable: true
    },
    {
        header: "Name",
        accessorKey: "name",
        sortable: true
    },
    {
        header: "Department",
        accessorKey: "department",
        sortable: true
    },
    {
        header: "Status",
        accessorKey: "status",
        sortable: true
    }
];

const grid = document.querySelector("#employee-grid");
const gridHead = grid.querySelector("thead");
const gridBody = document.querySelector("#grid-body");
const gridStatus = document.querySelector("#grid-status");

const gridProps = {
    data: employeeData,
    columns: employeeColumns,
    ariaLabel: "Employee directory",
    onRowSelect: (item) => {
        console.log("Selected employee:", item.id);
    }
};

function renderDataGrid(props) {
    const errors = validateDataGridProps(props);

    if (errors.length > 0) {
        gridStatus.textContent = errors.join(" ");
        gridBody.replaceChildren();
        return;
    }

    const headerRow = document.createElement("tr");
    headerRow.setAttribute("role", "row");

    for (const column of props.columns) {
        const headerCell = document.createElement("th");

        headerCell.scope = "col";
        headerCell.setAttribute("role", "columnheader");
        headerCell.textContent = column.header;

        headerRow.append(headerCell);
    }

    gridHead.replaceChildren(headerRow);

    const rows = [];

    for (const item of props.data) {
        const row = document.createElement("tr");
        row.setAttribute("role", "row");

        for (const [index, column] of props.columns.entries()) {
            const cell = document.createElement("td");
            const value = item[column.accessorKey];

            cell.setAttribute("role", "gridcell");
            cell.tabIndex = rows.length === 0 && index === 0 ? 0 : -1;
            cell.textContent = value == null ? "" : String(value);

            row.append(cell);
        }

        rows.push(row);
    }

    gridBody.replaceChildren(...rows);

    const count = props.data.length;

    gridStatus.textContent =
        `${count} employee record${count === 1 ? "" : "s"} displayed.`;
}

grid.setAttribute("aria-label", gridProps.ariaLabel);

renderDataGrid(gridProps);
