import React, { useEffect } from 'react';
import Link from 'next/link';
import { Task, TaskStatus, useDeleteTaskMutation, useUpdateTaskMutation } from '../generated/graphql-frontend';
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
    const [updateTaskMutation, {
        loading: updateTaskLoading,
        error: updateTaskError
    }] = useUpdateTaskMutation({ errorPolicy: 'all' })
    const handleStatusChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStatus = e.target.checked ? TaskStatus.Completed : TaskStatus.Active
        await updateTaskMutation({ variables: { input: { id: task.id, status: newStatus } } })
    }
    useEffect(()=>{
        if(updateTaskError){
            alert('An error')
        }

    },[updateTaskError])
    useEffect(() => {
        if (error) {
            alert('An error occurred')
        }

    }, [error])
    return (
        <li className="task-list-item" key={ task.title + task.id + task.status }>
            <label className={ 'checkbox' }>
                <input type="checkbox" onChange={ handleStatusChange }
                       checked={ task.status === TaskStatus.Completed }
                       disabled={ updateTaskLoading }/>
                <span className="checkbox-mark">&#10003;</span>

            </label>
            <Link href={ '/update/[id]' } as={ `/update/${ task.id }` }>
                <a className="task-list-item-title"> { task.title }</a>
            </Link>
            <button className="task-list-item-delete"
                    disabled={ loading }
                    onClick={ handleDeleteClick }
            >&times;</button>
        </li>
    )
}
export default TaskListItem
