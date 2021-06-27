import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useCreateTAskMutation } from '../generated/graphql-frontend';

interface Props {
    onSuccess: () => void
}

const CreateTaskForm: React.FC<Props> = ({ onSuccess }) => {
    const [title, setTitle] = useState('')
    const [createTask, { loading, error }] = useCreateTAskMutation()
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value)
    }
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!loading) {
            try {
                await createTask({
                    variables: {
                        input: {
                            title
                        }
                    }
                })
                setTitle('')
                onSuccess()
            } catch (e) {
                console.log(e)
            }
        }


    }
    return <form onSubmit={ handleSubmit }>
        { error && <p className="alert-error">An error occurred</p> }
        <input
            type="text"
            name="title"
            placeholder="Let's add a new task!"
            autoComplete="off"
            className="text-input new-task-text-input"
            value={ title }
            onChange={ onChangeHandler }
        />
    </form>
}
export default CreateTaskForm
