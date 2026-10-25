/**
 * Defines a column in the Data-Grid.
 *
 * @template T
 * @typedef {Object} ColumnDef
 * @property {string} header - The column header displayed to the user.
 * @property {keyof T} accessorKey - The property used to retrieve cell data.
 * @property {boolean} [sortable] - Whether the column supports sorting.
 */

/**
 * Defines the properties accepted by the Data-Grid.
 *
 * @template T
 * @typedef {Object} DataGridProps
 * @property {T[]} data - The records displayed in the grid.
 * @property {ColumnDef<T>[]} columns - The column definitions.
 * @property {(item: T) => void} [onRowSelect] - Callback invoked when a row is selected.
 * @property {string} ariaLabel - Accessible name of the Data-Grid.
 */

/**
 * Validates the basic structure of Data-Grid properties.
 *
 * @param {DataGridProps<Object>} props - The Data-Grid properties.
 * @returns {string[]} An array of validation errors.
 */
export function validateDataGridProps(props) {
    const errors = [];

    if (!props || typeof props !== "object") {
        return ["Data-Grid properties must be an object."];
    }

    if (!Array.isArray(props.data)) {
        errors.push("The data property must be an array.");
    }

    if (!Array.isArray(props.columns) || props.columns.length === 0) {
        errors.push("The columns property must be a non-empty array.");
    } else {
        for (const column of props.columns) {
            if (!column || typeof column !== "object") {
                errors.push("Each column must be an object.");
                continue;
            }

            if (typeof column.header !== "string" || column.header.trim() === "") {
                errors.push("Each column must have a non-empty header.");
            }

            if (
                typeof column.accessorKey !== "string" &&
                typeof column.accessorKey !== "number" &&
                typeof column.accessorKey !== "symbol"
            ) {
                errors.push("Each column must have a valid accessorKey.");
            }

            if (
                column.sortable !== undefined &&
                typeof column.sortable !== "boolean"
            ) {
                errors.push("The sortable property must be a boolean.");
            }
        }
    }

    if (typeof props.ariaLabel !== "string" || props.ariaLabel.trim() === "") {
        errors.push("The ariaLabel property must be a non-empty string.");
    }

    if (
        props.onRowSelect !== undefined &&
        typeof props.onRowSelect !== "function"
    ) {
        errors.push("The onRowSelect property must be a function.");
    }

    return errors;
}