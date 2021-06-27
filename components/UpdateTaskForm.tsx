import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useUpdateTaskMutation } from '../generated/graphql-frontend';
import { useRouter } from 'next/router';

interface Values {
    title: string
}

interface Props {
    id: number
    initialValues: Values
}

const UpdateTaskForm: React.FC<Props> = ({ id, initialValues }) => {
    const [values, setValues] = useState<Values>(initialValues)
    const [updateTask, { loading, error }] = useUpdateTaskMutation()
    const router = useRouter()

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setValues((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const result = await updateTask({ variables: { input: { id, title: values.title } } })
            if (result.data?.updateTask) {
                await router.push('/')
            }
        } catch (e) {
            console.log(e.message)
        }


    }

    return <form onSubmit={ handleSubmit }>
        { error && <p className="alert-error">{ error.message }</p> }
        <p>

            <label className={ 'field-label' }>Title</label>
            <input type="text" name="title" className="text-input" value={ values.title }
                   onChange={ onChangeHandler }/>
        </p>
        <p>
            <button className="button" type="submit" disabled={ loading }>{ loading ? 'Loading' : 'Save' }</button>
        </p>
    </form>
}
export default UpdateTaskForm
