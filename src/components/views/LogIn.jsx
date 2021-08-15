import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, Input2, Title, Container, Button } from "../component.controls";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import useAppContext from "../../hooks/useAppContext";
import * as sessionService from "../../services/session.service";

const LogIn = () => {
    // CONTEXT  #####################################################################################################################################
    const { setTokenDataInCookieAndContext } = useAppContext();

    // STATE ########################################################################################################################################
    const [dialogOptions, setDialogOptions] = useState({});

    // CRUD VALIDATIONS #############################################################################################################################
    const schemaCrud = Yup.object().shape({
        email: Yup.string()
            .required('Required!')
            .lowercase()
            .trim()
            .email("Must be a valid email! e.g. mail@mail.com"),
        password: Yup.string()
            .required('Required')
    });

    const { register, handleSubmit, errors } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(schemaCrud)
    });

    // HANDLES #####################################################################################################################################
    const handleLogin = async credentials => {
        const tokenData = await sessionService.getTokenDataByCredentials(credentials);
        if (tokenData.error || tokenData.resultCode === 0) return setDialogOptions({family: "info", title: 'Alert', text : tokenData.resultMessage});
        setTokenDataInCookieAndContext(tokenData.result); //tokenData.result has the TOKEN. 
    };
    
    // JSX ##########################################################################################################################################
    return (
        <Container.Basic width="400px">
            <Title.Basic>Log In</Title.Basic>
            <Input2.Validation name="email" type="email" label="Email" register={register} error={errors.email} />
            <Input2.Validation name="password" type="password" label="Password" register={register} error={errors.password} />
            <Button.Basic onClick={handleSubmit(handleLogin)} margin="9px 0 0 0">Log In</Button.Basic>

            {/* DIALOG  ############################################################################################################################# */}
            <Dialog.Action options={dialogOptions} close={() => setDialogOptions({})} />
        </Container.Basic>
    );
};

export default LogIn;