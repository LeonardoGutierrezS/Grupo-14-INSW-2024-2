import { useEffect, useRef, useState } from 'react';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import "tabulator-tables/dist/css/tabulator.min.css";
import '@styles/table.css';

function useNoSelectable({ data, columns, filter, dataToFilter, initialSortName }) {
    const tableRef = useRef(null);
    const [table, setTable] = useState(null);
    const [isTableBuilt, setIsTableBuilt] = useState(false);

    useEffect(() => {
        if (tableRef.current) {
            const tabulatorTable = new Tabulator(tableRef.current, {
                data: [], // Data inicial vacía
                columns: columns, // Usamos las columnas directamente sin la columna seleccionable
                layout: "fitColumns",
                responsiveLayout: "collapse",
                pagination: true,
                paginationSize: 5,

                rowHeight: 46,
                langs: {
                    "default": {
                        "pagination": {
                            "first": "Primero",
                            "prev": "Anterior",
                            "next": "Siguiente",
                            "last": "Último",
                        }
                    }
                },
                initialSort: [
                    { column: initialSortName, dir: "asc" }
                ],
            });

            tabulatorTable.on("tableBuilt", function () {
                setIsTableBuilt(true);
                tabulatorTable.redraw(true); // Ajusta las columnas al contenido
            });

            setTable(tabulatorTable);

            return () => {
                tabulatorTable.destroy();
                setIsTableBuilt(false);
                setTable(null);
            };
        }
    }, []);

    // Reemplazar datos al cambiar
    useEffect(() => {
        if (table && isTableBuilt) {
            table.replaceData(data);
        }
    }, [data, table, isTableBuilt]);

    // Filtros dinámicos
    useEffect(() => {
        if (table && isTableBuilt) {
            if (filter) {
                table.setFilter(dataToFilter, "like", filter);
            } else {
                table.clearFilter();
            }
            table.redraw();
        }
    }, [filter, table, dataToFilter, isTableBuilt]);

    return { tableRef };
}

export default useNoSelectable;
