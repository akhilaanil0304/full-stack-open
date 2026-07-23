const Filter = ({ filterTerm, handleFilterChange }) => (
  <div>
    filter shown with: <input value={filterTerm} onChange={handleFilterChange} />
  </div>
)

export default Filter 