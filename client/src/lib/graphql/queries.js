import { getAccessToken } from '../auth'
import { ApolloClient, ApolloLink, concat, InMemoryCache, createHttpLink, gql } from '@apollo/client'

// const client = new GraphQLClient('http://localhost:9000/graphql', {
//     headers: () => {
//         const accessToken = getAccessToken()
//         if (accessToken) {
//             return { 'Authorization': `Bearer ${accessToken}`}
//         }
//     }
// })

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

const apolloClient = new ApolloClient({
    link: concat(authLink, httpLink),
    cache: new InMemoryCache()

})

export async function createJob ({title, description }) {
    const mutation = gql`
        mutation CreateJob($input: CreateJobInput!) {
            job: createJob(input: $input){
                id
            }
        }
    `;
    const { data } = await apolloClient.mutate({
        mutation,
        variables: { input: { title, description }}
    })
    return data.job
}

export async function getCompany (id) {
    const query = gql`
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
    `
    const { data } = await apolloClient.query({
        query,
        variables: { id }    
    })

    return data.company
}

export async function getJob (id) {
    const query = gql`
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
    `
    const { data } = await apolloClient.query({
        query,
        variables: { id }    
    })

    return data.job
}

export async function getJobs () {
    const query = gql`
        query {
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
    `
    const {data} = await apolloClient.query({ query })

    return data.jobs
}
