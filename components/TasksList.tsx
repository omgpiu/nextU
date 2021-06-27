import React from 'react';
import { Task } from '../generated/graphql-frontend';
import TaskListItem from './TaskListItem';

interface Props {
    tasks: Task[]
}

const TasksList: React.FC<Props> = ({ tasks }) => {
    return (
        <ul className="task-list">
            { tasks.map(task => {
                return <TaskListItem task={ task } key={ task.id + task.title + task.status }/>
            }) }
        </ul>
    )
}
export default TasksList
