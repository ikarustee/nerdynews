import React from 'react'
import { Pagination } from 'semantic-ui-react'

const PaginationExamplePagination = ({totalPages}) => (
  <Pagination 
  defaultActivePage={0} totalPages={totalPages} />
)

export default PaginationExamplePagination
