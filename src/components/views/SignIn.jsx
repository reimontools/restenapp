import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, Input, Title, Container, Button } from "../../component.controls";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import axios from '../../config/axios';
import useAppContext from "../../hooks/useAppContext";

const SignIn = () => {
    // CONTEXT  #####################################################################################################################################
    const { signIn } = useAppContext();

    // STATE ########################################################################################################################################
    const [dialogOptions, setDialogOptions] = useState({});

    // CRUD VALIDATIONS #############################################################################################################################
    const schemaCrud = Yup.object().shape({
        email: Yup.string()
            .required('Required!'),
        password: Yup.string()
            .required('Required')
    });

    const { register: registerCrud, handleSubmit: handleSubmitCrud, errors: errorsCrud } = useForm({
        mode: 'onSubmit',
        resolver: yupResolver(schemaCrud)
    });

    // HANDLES #####################################################################################################################################
    const handleLogIn = async data => {
        try {
            const res = await axios.post("auth/login", data);
            if (res.data.error) {
                return setDialogOptions({family: "info", title: 'Alert', text : res.data.resultMessage})
            };
            if(res.data.resultCode === 0) {
                return setDialogOptions({family: "info", title: 'Alert', text : res.data.resultMessage})
            };
            signIn(res.data.result);
        } catch(err) {
            console.log('Err: ' + err);
        };
    };
    
    // JSX ##########################################################################################################################################
    return (
        <Container.Basic width="400px">
            <Title.Basic>Sign In</Title.Basic>
            <Input.TextValidation name="email" type="email" placeholder="email@email.com" register={registerCrud} error={errorsCrud.email}/>
            <Input.TextValidation name="password" type="password" placeholder="Set your password" register={registerCrud} error={errorsCrud.password} />
            <Button.Basic onClick={handleSubmitCrud(handleLogIn)} width="100%">Sign In</Button.Basic>

            {/* DIALOG  ############################################################################################################################# */}
            <Dialog.Action options={dialogOptions} close={() => setDialogOptions({})} />
        </Container.Basic>
    );
};

export default SignIn;