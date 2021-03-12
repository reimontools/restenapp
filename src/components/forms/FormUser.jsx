import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, Input, Button } from "../../component";
import {db} from "../../config/firebase";

const FormUser = ({preLoadedData}) => {

    useEffect(() => reset(preLoadedData), []);

    /*VALIDATIONS ####################################################################################*/ 
    const schema = Yup.object().shape({
        name: Yup.string().matches(/^([^0-9]*)$/,'Name should not containt numbers').required('Required'),
        surname: Yup.string().matches(/^([^0-9]*)$/,'Name should not containt numbers').required('Required'),
        email: Yup.string().email("Invalid format").required('Required')
    });

    const { register, handleSubmit, errors, reset } = useForm({
        mode: 'onSubmit',
        resolver: yupResolver(schema)
    });
    
    /*CRUD ###########################################################################################*/ 
    const onSubmit = data => {
        console.log(data);
        setUser(data);
    };

    const setUser = async (dataObject) => {
        await db.collection('user').doc().set(dataObject);
    };

    return (
        <Card.Primary title="User">
            <Input.TextValidation name="name" placeholder="Name" register={register} error={errors.name} />
            <Input.TextValidation name="surname" placeholder="Surname" register={register} error={errors.surname} />
            <Input.TextValidation name="email" type="email" placeholder="email@email.com" register={register} error={errors.email}/>
            <Button.Primary action={handleSubmit(onSubmit)}>Save</Button.Primary>   
        </Card.Primary>
    );
};

export default FormUser;