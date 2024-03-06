import { createJob, deleteJob, updateJob, getJob, getJobs, getJobsByCompany, countJobs } from './db/jobs.js'
import { getCompany } from './db/companies.js'
import { GraphQLError } from 'graphql'

export const resolvers = {
    Query: {
        jobs: async (_root, { limit, offset }) => {
            const items = await getJobs(limit, offset)
            const totalCount= await countJobs()
            return { items, totalCount }
        },
        job: async (_root, {id}) => {
            const job = await getJob(id)
            if (!job)
                throw notFoundError(`No job with id = '${id}'`)
            return job
        },
        company: async (_root, {id}) => {

            const company = await getCompany(id)

            if (!company) {
                throw notFoundError (`No company with id = '${id}'`)
            }

            return company
        }
    },
    Mutation: {
        createJob: (_root, { input: {title, description}}, context) => {
            if (!context.user){
                throw unauthorizedError (`Missing authentication`)
            }
            return createJob ({title, description, companyId: context.user.companyId})
        },
        updateJob: async (_root, { input: {id, title, description}}, context) => {
            if (!context.user){
                throw unauthorizedError (`Missing authentication`)
            }
            const job = await updateJob ({id, title, description, companyId: context.user.companyId})
            if (!job) {
                throw notFoundError (`No job with id = '${id}' in your company`)
            }
            return job
        },
        deleteJob: async (_root, { id }, context) => {
            if (!context.user){
                throw unauthorizedError (`Missing authentication`)
            }
            const job = await deleteJob (id, context.user.companyId)
            if (!job) {
                throw notFoundError (`No job with id = '${id}' in your company`)
            }
            return job
        }
    },
    Company: {
        jobs: (company) => getJobsByCompany(company.id)
    },
    Job: {
        company: (job, _args, { companyLoader }) => companyLoader.load(job.companyId),
        date: (job) => toIsoDate(job.createdAt),
    },

}

function notFoundError (message) {
    return new GraphQLError (message, {extensions: {code: 'NOT_FOUND'}})
}

function unauthorizedError (message) {
    return new GraphQLError (message, {extensions: {code: 'UNAUTHORIZED'}})
}

function toIsoDate (value) {
    return value.slice(0, 'yyyy-mm-dd'.length)
}