import { getAccessToken } from '../auth'
import { ApolloClient, ApolloLink, concat, InMemoryCache, createHttpLink, gql } from '@apollo/client'

export const companyByIdQuery = gql`
    query CompanyById($id: ID!) {
        company(id: $id) {
            id
            name
            description
            jobs {
                id
                date
                description
                title
            }
        }
    }
`;

export const jobByIdQuery = gql`
    query JobById($id: ID!) {
        job(id: $id) {
            id
            date
            title
            company {
                id
                name
            }
            description
        }
    }
`;

export const jobsQuery = gql`
    query Jobs{
        jobs {
            id
            date
            title
            company {
                id
                name
            }
        }
    }
`;

export const createJobMutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
        job: createJob(input: $input){
            id
        }
    }
`;

const httpLink = createHttpLink({ uri: 'http://localhost:9000/graphql'})
const authLink = new ApolloLink((operation, forward) => {
    const accessToken = getAccessToken()
    if (accessToken) {
        // return { 'Authorization': `Bearer ${accessToken}`}
        operation.setContext({
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }
    return forward(operation)
})

export const apolloClient = new ApolloClient({
    link: concat(authLink, httpLink),
    cache: new InMemoryCache()
})