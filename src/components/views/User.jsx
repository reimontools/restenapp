
import { Form, Input } from "../../component";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import {db} from "../../config/firebase";

const User = () => {

    const agregarWea = async (dataObject) => {
        await db.collection('user').doc().set(dataObject);
    }
    
    const schema = Yup.object().shape({
        name: Yup.string().matches(/^([^0-9]*)$/,'Name should not containt numbers').required('Required'),
        surname: Yup.string().required('Required'),
        email: Yup.string().email("Invalid format").required('Required')
    });

    const { register, handleSubmit, errors } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(schema),
    });

    const onSubmit = data => {
        console.log(data);
        agregarWea(data);
    };
    
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} style={{width: '80%'}}>
                <Form.StyleOne title="User">
                    <Input.Text name="name" placeholder="Name" register={register} error={errors.name} />
                    <Input.Text name="surname" placeholder="Surname" register={register} error={errors.surname} />
                    <Input.Text name="email" type="email" placeholder="Email" register={register} error={errors.email}/>
                    <Input.Text name="message" placeholder="Write you message..." type="textarea" register={register} />
                    <button type="submit">Submit</button>    
                </Form.StyleOne>
            </form>
        </>
    );
};

export default User;