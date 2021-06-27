import Head from 'next/head'

import { initializeApollo } from '../lib/client';
import {
    TasksDocument,
    TasksQuery,
    TasksQueryVariables,
    TaskStatus,
    useTasksQuery
} from '../generated/graphql-frontend';
import TasksList from '../components/TasksList';
import CreateTaskForm from '../components/CreateTaskForm';
import TaskFilter from '../components/TaskFilter';
import { useRouter } from 'next/router';
import Error from 'next/error';
import { GetServerSideProps } from 'next';
import { useEffect, useRef } from 'react';

const isTaskStatus = (value: string): value is TaskStatus => Object.values(TaskStatus).includes(value as TaskStatus)

export default function Home() {
    const router = useRouter()
    const status = typeof router.query.status === 'string' ? router.query.status : undefined
    if (status !== undefined && !isTaskStatus(status)) {
        return <Error statusCode={ 404 }/>
    }
    const prevStat = useRef(status)
    useEffect(() => {
        prevStat.current = status
    }, [status])
    const result = useTasksQuery({
        variables: { status },
        fetchPolicy: prevStat.current === status ? 'cache-first' : 'cache-and-network'
    })
    const tasks = result.data?.tasks
    return (
        <div>
            <Head>
                <title>Tasks</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <CreateTaskForm onSuccess={ result.refetch }/>
            { result.loading && !tasks ? (<p>Loading tasks</p>) : result.error ? (
                <p>Some error</p>) : tasks && tasks.length > 0 ?
                (<TasksList tasks={ tasks }/>) : (<p className="no-tasks-message">You dont have tasks</p>) }
            <TaskFilter status={ status }/>
        </div>
    )
}
export const getServerSideProps: GetServerSideProps = async (context) => {
    const status = typeof context.params?.status === 'string' ? context.params.status : undefined
    if (status === undefined || isTaskStatus(status)) {
        const apolloClient = initializeApollo();
        await apolloClient.query<TasksQuery, TasksQueryVariables>({
            query: TasksDocument,
            variables: { status }
        })
        return {
            props: {
                initialApolloState: apolloClient.cache.extract()
            }
        }
    }
    return { props: {} }
}
