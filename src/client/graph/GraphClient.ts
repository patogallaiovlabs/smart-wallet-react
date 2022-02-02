import { gql, OperationVariables, QueryResult, useQuery } from '@apollo/client';



export default class GraphClient {

        static USER_BALANCE_QUERY = `
            user($id: ID!, $status: String!) {
                user(id: $id) {
                    id
                    balance (where: {status: $status}, orderBy:time,orderDirection:desc){
                        status
                        metadata
                        currencyAddress
                        time
                    }
                }
            }
        `;

        static USER_QUERY = `
            user($id: ID!) {
                user(id: $id) {
                    id
                    address
                    publicKey
                }
            }
        `;

        static LOAD_QUERY = (query:any) => gql`
            query ${query}
        `;

}