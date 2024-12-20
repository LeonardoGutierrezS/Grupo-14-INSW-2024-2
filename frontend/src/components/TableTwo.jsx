//import React from 'react';
import useNoSelectable from '@hooks/table/noSelectable'; 

const TableNoSelectable = ({ data, columns }) => {
    const { tableRef } = useNoSelectable({ data, columns });

    return (
        <div className="table-container">
            <div ref={tableRef}></div>
        </div>
    );
};

export default TableNoSelectable;
