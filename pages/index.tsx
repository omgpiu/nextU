import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { initializeApollo } from '../lib/client';
import { TasksDocument, TasksQuery, useTasksQuery } from '../generated/graphql-frontend';

export default function Home() {
    const result = useTasksQuery()
    const tasks = result.data?.tasks
    return (
        <div className={ styles.container }>
            <Head>
                <title>Tasks</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            { tasks && tasks.length > 0 && tasks.map(task => {
                return <div key={ task.title + task.id + task.status }>
                    { task.title }
                    ({ task.status })

                </div>
            }) }

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
