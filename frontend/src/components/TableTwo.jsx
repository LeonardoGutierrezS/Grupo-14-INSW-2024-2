import useNoSelectable from '../hooks/table/noSelectable';

export default function Table({ data, columns, filter, dataToFilter, initialSortName }) {
  const { tableRef } = useNoSelectable({ data, columns, filter, dataToFilter, initialSortName });

  return (
    <div className='table-container'>
      <div ref={tableRef}></div>
    </div>
  );
}
