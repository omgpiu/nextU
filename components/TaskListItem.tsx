import React, { useEffect } from 'react';
import Link from 'next/link';
import { Task, useDeleteTaskMutation } from '../generated/graphql-frontend';
import { Reference } from '@apollo/client';

interface Props {
    task: Task
}

const TaskListItem: React.FC<Props> = ({ task }) => {
    const [deleteTask, { loading, error }] = useDeleteTaskMutation({
        variables: { id: task.id },
        errorPolicy: 'all',
        update: (cache, mutationResult) => {
            const deletedTask = mutationResult.data?.deleteTask
            if (deletedTask) {
                cache.modify({
                    fields: {
                        tasks(taskRefs: Reference[], { readField }) {
                            return taskRefs.filter(taskRef => {
                                return readField('id', taskRef) !== deletedTask.id
                            })
                        }
                    }
                });
            }
        }
    })
    const handleDeleteClick = async () => {
        try {
            await deleteTask()
        } catch (e) {
            console.log(e)
        }

    }
    useEffect(() => {
        if (error) {
            alert('An error occurred')
        }

    }, [error])
    return (<li className="task-list-item" key={ task.title + task.id + task.status }>
        <Link href={ '/update/[id]' } as={ `/update/${ task.id }` }>
            <a className="task-list-item-title"> { task.title }</a>
        </Link>
        <button className="task-list-item-delete"
                disabled={ loading }
                onClick={ handleDeleteClick }
        >&times;</button>
    </li>)
}
export default TaskListItem
