import { getJob, getJobs } from './db/jobs.js'
import { getCompany } from './db/companies.js'

export const resolvers = {
    Query: {
        jobs: () => {
            return getJobs()
        },
        job: (_root, {id}) => {
            return getJob(id)
        },
        company: (_root, {id}) => {
            return getCompany(id)
        }
    },

    Job: {
        date: (job) => toIsoDate(job.createdAt),
        company: (job) => getCompany(job.companyId)
    },

}


function toIsoDate (value) {
    return value.slice(0, 'yyyy-mm-dd'.length)
}