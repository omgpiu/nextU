import React from 'react';
import Link from 'next/link';
import { Task } from '../generated/graphql-frontend';

interface Props {
    task: Task
}

const TaskListItem: React.FC<Props> = ({ task }) => {
    return (<li className="task-list-item" key={ task.title + task.id + task.status }>
        <Link href={ '/update/[id]' } as={ `/update/${ task.id }` }>
            <a className="task-list-item-title"> { task.title }</a>
        </Link>
        <button className='task-list-item-delete'>&times;</button>
    </li>)
}
export default TaskListItem
