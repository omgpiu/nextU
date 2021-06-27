import { Resolvers } from '../generated/graphq-backed';
import { OkPacket } from 'mysql';
import { UserInputError } from 'apollo-server-micro';
import {ServerlessMysql} from 'serverless-mysql';

export interface ApolloContext {
    db: ServerlessMysql;
}


interface TaskDbRow {
    id: number;
    title: string;
    status: TaskStatus;
}

type TasksDbQueryResult = TaskDbRow[];

enum TaskStatus {
    Active = 'active',
    Completed = 'completed',
}

const getTaskById = async (id: number, db: ServerlessMysql) => {
    const tasks = await db.query<TasksDbQueryResult>('SELECT id,title,status FROM tasks WHERE id = ?',
        [id])
    return tasks.length ? { id: tasks[0].id, title: tasks[0].title, status: tasks[0].status } : null;
}
export const resolvers: Resolvers<ApolloContext> = {
    Query: {
        async tasks(
            parent,
            args,
            context
        ) {
            const { status } = args;
            let query = 'SELECT id, title, status FROM tasks';
            const queryParams: string[] = [];
            if (status) {
                query += ' WHERE status = ?';
                queryParams.push(status);
            }
            const tasks = await context.db.query<TasksDbQueryResult>(
                query,
                queryParams
            );
            await context.db.end();
            return tasks
        },
        async task(parent, args, context) {
            const tasks = await context.db.query<TasksDbQueryResult>('SELECT id,title,status FROM tasks WHERE id = ?',
                [args.id])
            return await getTaskById(args.id, context.db)
        },
    },
    Mutation: {
        async createTask(
            parent,
            args,
            context
        ) {
            const result = await context.db.query<OkPacket>(
                'INSERT INTO tasks (title,status) VALUES(?, ?)',
                [args.input.title, TaskStatus.Active]
            );
            return {
                id: result.insertId,
                title: args.input.title,
                status: TaskStatus.Active,
            };
        },
        async updateTask(parent, args, context) {
            const columns: string[] = []
            const sqlParams: (string | number)[] = []
            if (args.input.title) {
                columns.push('title = ?')
                sqlParams.push(args.input.title)
            }
            if (args.input.status) {
                columns.push('status = ? ')
                sqlParams.push(args.input.status)
            }
            sqlParams.push(args.input.id)
            await context.db.query(`UPDATE tasks SET ${columns.join(',')} WHERE id =?`,
                sqlParams
            )

            return await getTaskById(args.input.id, context.db);


        },
        async deleteTask(parent, args, context) {
            const task = await getTaskById(args.id, context.db)
            if (!task) throw  new UserInputError('Task not found')
            await context.db.query('DELETE FROM tasks WHERE id = ?', [args.id])
            return task
        },
    },
};
