import { useState } from "react";
import { useForm } from "react-hook-form";
import { Container, ModalNew, Title, Button, Dialog, Input2 } from "../../component.controls";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import axios from '../../../config/axios'
import { LOWERCASEREGEX, UPPERCASEREGEX, NUMERICREGEX } from "../../../helpers/parameters.helper";

const Concre = ({user, isOpen, close}) => {
    // STATE ####################################################################################################################################
    const [dialogOptions, setDialogOptions] = useState({});

    // PASSWORD VALIDATIONS #####################################################################################################################
    const schema = Yup.object().shape({
        concre: Yup.string()
            .required('Required!')
            .min(8, "Minimun 8 characters required!")
            .matches(NUMERICREGEX, 'One number required!')
            .matches(LOWERCASEREGEX, 'One lowercase required!')
            .matches(UPPERCASEREGEX, 'One uppercase required!'),
        concreConfirm: Yup.string()
            .required('Required!')
            .oneOf([Yup.ref('concre')], 'Password must be the same!')
    });

    const { register, handleSubmit, errors, reset } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(schema)
    });

    // CRUD #####################################################################################################################################
    const updateUserConcre = async data => {
        try {
            const res = await axios.post("user/concre", {user_id: user.user_id, ...data});
            if (res.data.result.cod === 0) {
                handleCloseConcre()
            } else {
                setDialogOptions({family: "info", title: 'Alert', text : 'Error: ' + res.data.result.msg})
            };
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    // HANDLES ######################################################################################################################################
    const handleCloseConcre = () => {
        reset({concre: "", concreConfirm: ""});
        close()
    };

    // JSX ######################################################################################################################################
    return (
        <ModalNew.ForForm isOpen={isOpen} closeModal={handleCloseConcre}>
            <Container.Basic>
                <Title.Basic>Update Password</Title.Basic>
                <Input2.Validation name="concre" label="Password *" type="password" register={register} error={errors.concre} />
                <Input2.Validation name="concreConfirm" label="Confirm password *" type="password" register={register} error={errors.concreConfirm} />
                <Button.Basic onClick={handleSubmit(updateUserConcre)} margin="9px 0 0 0">Save</Button.Basic>
            </Container.Basic>
            
            {/* DIALOG ############################################################################################################################## */}
            <Dialog.Action options={ dialogOptions } close={() => setDialogOptions({})} />
        </ModalNew.ForForm>
    );
};

export default Concre;