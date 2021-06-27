import Head from 'next/head'

import { initializeApollo } from '../lib/client';
import { TasksDocument, TasksQuery, useTasksQuery } from '../generated/graphql-frontend';
import TasksList from '../components/TasksList';
import CreateTaskForm from '../components/CreateTaskForm';

export default function Home() {
    const result = useTasksQuery()
    const tasks = result.data?.tasks
    return (
        <div>
            <Head>
                <title>Tasks</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <CreateTaskForm onSuccess={ result.refetch }/>
            { result.loading ? (<p>Loading tasks</p>) : result.error ? (<p>Some error</p>) : tasks && tasks.length > 0 ?
                (<TasksList tasks={ tasks }/>) : (<p className="no-tasks-message">You dont have tasks</p>) }
        </div>
    )
}
export const getStaticProps = async () => {
    const apolloClient = initializeApollo();
    await apolloClient.query<TasksQuery>({
        query: TasksDocument,
    })
    return {
        props: {
            initialApolloState: apolloClient.cache.extract()
        }
    }

}
