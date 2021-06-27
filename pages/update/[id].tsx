import { GetServerSideProps } from 'next';
import { initializeApollo } from '../../lib/client';
import { TaskDocument, TaskQuery, TaskQueryVariables, useTaskQuery } from '../../generated/graphql-frontend';
import React from 'react';
import { useRouter } from 'next/router';
import Error from 'next/error';
import UpdateTaskForm from '../../components/UpdateTaskForm';

interface Props {


}

const UpdateTask: React.FC<Props> = () => {
    const router = useRouter()
    const id = typeof router.query.id === 'string' ? parseInt(router.query.id, 10) : NaN
    if (!id) {
        return <Error statusCode={ 404 }/>
    }
    const { data, loading, error } = useTaskQuery({ variables: { id } })
    const task = data?.task
    return loading
        ? <p>Loading...</p>
        : error ? <p>An error occured.</p>
            : task ?
                <div><UpdateTaskForm initialValues={ { title: task.title } } id={ task.id }/></div>
                : <p>Task not found</p>

}
export const getServerSideProps: GetServerSideProps = async (context) => {
    const id = typeof context.params?.id === 'string' ? parseInt(context.params.id, 10) : NaN
    if (id) {
        const apolloClient = initializeApollo()
        await apolloClient.query<TaskQuery, TaskQueryVariables>({
            query: TaskDocument,
            variables: { id }
        })
        return { props: { initialApolloState: apolloClient.cache.extract() } }
    }
    return { props: {} }

}

export default UpdateTask
