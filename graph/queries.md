### Find notes, ordered by address.
{
  notes (orderBy : ownerAddress) {
    id
    ownerAddress
    metadata
    access {
      id
    }
    status
  }
}


`graph codegen  --output-dir folder subgraph.yaml`
