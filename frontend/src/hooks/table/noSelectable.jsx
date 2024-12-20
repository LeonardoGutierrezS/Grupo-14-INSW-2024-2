import { useEffect, useRef, useState } from 'react';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import "tabulator-tables/dist/css/tabulator.min.css";
import '@styles/forTable.css';

function useNoSelectable({ data, columns, filter, dataToFilter, initialSortName }) {
    const tableRef = useRef(null);
    const [table, setTable] = useState(null);
    const [isTableBuilt, setIsTableBuilt] = useState(false);

    useEffect(() => {
        if (tableRef.current) {
            const tabulatorTable = new Tabulator(tableRef.current, {
                data: [], 
                columns: columns,
                layout: "fitData",
                responsiveLayout: "hide",
                pagination: true,
                paginationSize: 6,
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
                initialSort: [{ column: initialSortName, dir: "asc" }],
            });

            tabulatorTable.on("tableBuilt", () => {
                setIsTableBuilt(true);
                
            });

            setTable(tabulatorTable);

            return () => {
                tabulatorTable.destroy();
                setTable(null);
                setIsTableBuilt(false);
            };
        }
    }, []);

    
    useEffect(() => {
        if (table && isTableBuilt) {
            table.replaceData(data);
        }
    }, [data, table, isTableBuilt]);

    // Aplica filtros
    useEffect(() => {
        if (table && isTableBuilt) {
            if (filter) {
                table.setFilter(dataToFilter, "like", filter);
            } else {
                table.clearFilter();
            }
        }
    }, [filter, table, dataToFilter, isTableBuilt]);

    return { tableRef };
}

export default useNoSelectable;
