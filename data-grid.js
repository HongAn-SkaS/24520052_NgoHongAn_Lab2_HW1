
import { validateDataGridProps } from "./data-grid-contract.js";

const employeeData = [
    { id: "EMP-001", name: "Alex Morgan", department: "IT Support", status: "Active" },
    { id: "EMP-002", name: "Jamie Lee", department: "Infrastructure", status: "Active" },
    { id: "EMP-003", name: "Taylor Smith", department: "Security", status: "Inactive" },
    { id: "EMP-004", name: "Jordan Kim", department: "IT Support", status: "Active" },
    { id: "EMP-005", name: "Casey Nguyen", department: "Infrastructure", status: "Inactive" }
];

const employeeColumns = [
    { header: "Employee ID", accessorKey: "id", sortable: true },
    { header: "Name", accessorKey: "name", sortable: true },
    { header: "Department", accessorKey: "department", sortable: true },
    { header: "Status", accessorKey: "status", sortable: true }
];

const grid = document.querySelector("#employee-grid");
const gridHead = grid.querySelector("thead");
const gridBody = document.querySelector("#grid-body");
const gridStatus = document.querySelector("#grid-status");

const gridFilter = document.querySelector("#grid-filter");

const pageSizeSelect = document.querySelector("#page-size");
const previousPageButton = document.querySelector("#previous-page");
const nextPageButton = document.querySelector("#next-page");
const pageInfo = document.querySelector("#page-info");

const selectedEmployeeIds = new Set();

let focusedCell = {
    rowIndex: 0,
    columnIndex: 0
};

let currentPage = 1;
let pageSize = Number(pageSizeSelect.value);

let filterQuery = "";

const gridProps = {
    data: employeeData,
    columns: employeeColumns,
    ariaLabel: "Employee directory",
    onRowSelect: (item) => {
        console.log("Selected employee:", item.id);
    }
};

let sortState = {
    key: null,
    direction: "ascending"
};

function compareValues(firstValue, secondValue) {
    if (firstValue == null && secondValue == null) {
        return 0;
    }

    if (firstValue == null) {
        return 1;
    }

    if (secondValue == null) {
        return -1;
    }

    if (
        typeof firstValue === "number" &&
        typeof secondValue === "number"
    ) {
        return firstValue - secondValue;
    }

    return String(firstValue).localeCompare(
        String(secondValue),
        undefined,
        {
            numeric: true,
            sensitivity: "base"
        }
    );
}

function getFilteredData(data, columns) {
    if (filterQuery === "") {
        return data;
    }

    return data.filter((item) =>
        columns.some((column) => {
            const value = item[column.accessorKey];

            return value != null &&
                String(value)
                    .toLocaleLowerCase()
                    .includes(filterQuery);
        })
    );
}

function getSortedData(data) {
    if (sortState.key === null) {
        return data;
    }

    const column = gridProps.columns.find(
        (item) => item.accessorKey === sortState.key
    );

    if (!column || column.sortable !== true) {
        return data;
    }

    const sortedData = [...data];

    sortedData.sort((firstItem, secondItem) => {
        const result = compareValues(
            firstItem[column.accessorKey],
            secondItem[column.accessorKey]
        );

        return sortState.direction === "ascending"
            ? result
            : -result;
    });

    return sortedData;
}

function handleSort(column) {
    if (column.sortable !== true) {
        return;
    }

    if (sortState.key === column.accessorKey) {
        sortState.direction =
            sortState.direction === "ascending"
                ? "descending"
                : "ascending";
    } else {
        sortState.key = column.accessorKey;
        sortState.direction = "ascending";
    }

    currentPage = 1;
    focusedCell = { rowIndex: 0, columnIndex: 0 };

    renderDataGrid(gridProps);
}

function getPaginatedData(data) {
    const totalPages = Math.ceil(data.length / pageSize);
    const safeTotalPages = Math.max(1, totalPages);

    currentPage = Math.min(currentPage, safeTotalPages);
    currentPage = Math.max(1, currentPage);

    const startIndex = (currentPage - 1) * pageSize;

    return {
        rows: data.slice(startIndex, startIndex + pageSize),
        totalPages: safeTotalPages,
        totalRecords: data.length,
        startIndex
    };
}

function focusCell(rowIndex, columnIndex) {
    const rows = gridBody.querySelectorAll("tr");

    if (rows.length === 0 || gridProps.columns.length === 0) {
        return;
    }

    const safeRowIndex = Math.max(
        0,
        Math.min(rowIndex, rows.length - 1)
    );

    const safeColumnIndex = Math.max(
        0,
        Math.min(columnIndex, gridProps.columns.length - 1)
    );

    for (const cell of gridBody.querySelectorAll('[role="gridcell"]')) {
        cell.tabIndex = -1;
    }

    const targetCell = rows[safeRowIndex].querySelectorAll(
        '[role="gridcell"]'
    )[safeColumnIndex];

    if (!targetCell) {
        return;
    }

    focusedCell = {
        rowIndex: safeRowIndex,
        columnIndex: safeColumnIndex
    };

    targetCell.tabIndex = 0;
    targetCell.focus();
}

function selectRow(rowIndex, toggleSelection = false) {
    const filteredData = getFilteredData(
        gridProps.data,
        gridProps.columns
    );

    const sortedData = getSortedData(filteredData);
    const pagination = getPaginatedData(sortedData);
    const item = pagination.rows[rowIndex];

    if (!item) {
        return;
    }

    if (toggleSelection && selectedEmployeeIds.has(item.id)) {
        selectedEmployeeIds.delete(item.id);
    } else {
        selectedEmployeeIds.add(item.id);
    }

    const row = gridBody.querySelectorAll("tr")[rowIndex];

    if (row) {
        row.setAttribute(
            "aria-selected",
            String(selectedEmployeeIds.has(item.id))
        );
    }

    gridStatus.textContent = selectedEmployeeIds.has(item.id)
        ? `${item.name} selected.`
        : `${item.name} deselected.`;

    gridProps.onRowSelect?.(item);
}

function renderDataGrid(props) {
    const errors = validateDataGridProps(props);

    if (errors.length > 0) {
        gridStatus.textContent = errors.join(" ");
        gridHead.replaceChildren();
        gridBody.replaceChildren();
        return;
    }

    const headerRow = document.createElement("tr");
    headerRow.setAttribute("role", "row");

    for (const column of props.columns) {
        const headerCell = document.createElement("th");

        headerCell.scope = "col";
        headerCell.setAttribute("role", "columnheader");

        if (sortState.key === column.accessorKey) {
            headerCell.setAttribute("aria-sort", sortState.direction);
        }

        if (column.sortable === true) {
            const sortButton = document.createElement("button");

            sortButton.type = "button";

            const isActive = sortState.key === column.accessorKey;

            const arrow = !isActive
                ? ""
                : sortState.direction === "ascending"
                    ? " ↑"
                    : " ↓";

            sortButton.textContent = column.header + arrow;

            sortButton.setAttribute(
                "aria-label",
                isActive
                    ? `Sort by ${column.header}. Currently ${sortState.direction}. Activate to reverse the order.`
                    : `Sort by ${column.header} in ascending order.`
            );

            sortButton.addEventListener("click", () => {
                handleSort(column);
            });

            headerCell.append(sortButton);
        } else {
            headerCell.textContent = column.header;
        }

        headerRow.append(headerCell);
    }

    gridHead.replaceChildren(headerRow);

    const filteredData = getFilteredData(props.data, props.columns);
    const sortedData = getSortedData(filteredData);
    const pagination = getPaginatedData(sortedData);
    const rows = [];

    focusedCell.rowIndex = Math.min(
        focusedCell.rowIndex,
        Math.max(0, pagination.rows.length - 1)
    );

    focusedCell.columnIndex = Math.min(
        focusedCell.columnIndex,
        Math.max(0, props.columns.length - 1)
    );

    for (const [rowIndex, item] of pagination.rows.entries()) {
        const row = document.createElement("tr");

        row.setAttribute("role", "row");
        row.setAttribute(
            "aria-selected",
            String(selectedEmployeeIds.has(item.id))
        );

        for (const [columnIndex, column] of props.columns.entries()) {
            const cell = document.createElement("td");
            const value = item[column.accessorKey];

            cell.setAttribute("role", "gridcell");

            cell.tabIndex =
                rowIndex === focusedCell.rowIndex &&
                columnIndex === focusedCell.columnIndex
                    ? 0
                    : -1;

            cell.textContent = value == null ? "" : String(value);

            row.append(cell);
        }

        rows.push(row);
    }

    gridBody.replaceChildren(...rows);

if (pagination.rows.length > 0) {
    const targetCell = gridBody.querySelector(
        `tr:nth-child(${focusedCell.rowIndex + 1}) td:nth-child(${focusedCell.columnIndex + 1})`
    );

    if (targetCell && grid.contains(document.activeElement)) {
        targetCell.focus();
    }
}

gridStatus.textContent = filterQuery === ""
    ? `${pagination.totalRecords} employee record${pagination.totalRecords === 1 ? "" : "s"} found.`
    : `${pagination.totalRecords} matching employee record${pagination.totalRecords === 1 ? "" : "s"} found.`;
    pageInfo.textContent =
        `Page ${currentPage} of ${pagination.totalPages}`;

    previousPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage >= pagination.totalPages;
}

grid.setAttribute("aria-label", gridProps.ariaLabel);

document.querySelector("#grid-filter-form")
    .addEventListener("submit", (event) => {
        event.preventDefault();
    });

gridFilter.addEventListener("input", () => {
    filterQuery = gridFilter.value.trim().toLocaleLowerCase();
    currentPage = 1;
    focusedCell = { rowIndex: 0, columnIndex: 0 };

    renderDataGrid(gridProps);
});

previousPageButton.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage -= 1;
        focusedCell = { rowIndex: 0, columnIndex: 0 };

        renderDataGrid(gridProps);
    }
});

nextPageButton.addEventListener("click", () => {
    currentPage += 1;
    focusedCell = { rowIndex: 0, columnIndex: 0 };

    renderDataGrid(gridProps);
});

pageSizeSelect.addEventListener("change", () => {
    pageSize = Number(pageSizeSelect.value);
    currentPage = 1;
    focusedCell = { rowIndex: 0, columnIndex: 0 };

    renderDataGrid(gridProps);
});

gridBody.addEventListener("keydown", (event) => {
    const cell = event.target.closest('[role="gridcell"]');

    if (!cell) {
        return;
    }

    const row = cell.closest("tr");
    const rowIndex = Array.from(gridBody.children).indexOf(row);
    const cellIndex = Array.from(row.children).indexOf(cell);

    switch (event.key) {
        case "ArrowUp":
            event.preventDefault();
            focusCell(rowIndex - 1, cellIndex);
            break;

        case "ArrowDown":
            event.preventDefault();
            focusCell(rowIndex + 1, cellIndex);
            break;

        case "ArrowLeft":
            event.preventDefault();
            focusCell(rowIndex, cellIndex - 1);
            break;

        case "ArrowRight":
            event.preventDefault();
            focusCell(rowIndex, cellIndex + 1);
            break;

        case "Enter":
            event.preventDefault();
            selectRow(rowIndex);
            break;

        case " ":
        case "Spacebar":
            event.preventDefault();
            selectRow(rowIndex, true);
            break;

        default:
            break;
    }
});

gridBody.addEventListener("click", (event) => {
    const cell = event.target.closest('[role="gridcell"]');

    if (!cell) {
        return;
    }

    const row = cell.closest("tr");
    const rowIndex = Array.from(gridBody.children).indexOf(row);
    const cellIndex = Array.from(row.children).indexOf(cell);

    focusCell(rowIndex, cellIndex);
});

renderDataGrid(gridProps);
