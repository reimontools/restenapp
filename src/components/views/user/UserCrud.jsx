import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Container, ModalNew, Title, Button, Select2, Dialog, Input2 } from "../../component.controls";
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import axios from '../../../config/axios'
import { getCapitalInSentence } from "../../../helpers/parameters.helper";
import { useRol } from "../../../custom-hooks/useRol";

const UserCrud = ({fetch, user, isOpen, close}) => {        
    // CUSTOM HOOKS #################################################################################################################################
    const { rols } = useRol("fetchRols");

    // STATE ########################################################################################################################################
    const [dialogOptions, setDialogOptions] = useState({});

    // CRUD VALIDATIONS #############################################################################################################################
    const schemaCrud = Yup.object().shape({
        name: Yup.string()
            .required('Required !')
            .trim()
            .min(2, "Too short!")
            .transform(value => getCapitalInSentence(value)),
        email: Yup.string()
            .required('Required!')
            .lowercase()
            .trim()
            .email("Must be a valid email !"),
        rol_id: Yup.string()
            .required('Required!')
    });

    const { register, handleSubmit, errors, reset } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(schemaCrud)
    });

    // EFFECT ###################################################################################################################################
    useEffect(() => reset(user), [user, reset]);

    // CRUD #####################################################################################################################################
    const updateUser = async data => {
        try {
            const res = await axios.post("user", {user_id: user.user_id, ...data});
            switch(res.data.result.cod) {
                case 0:
                    fetch()
                    close();
                    break;
                case 1:
                    setDialogOptions({family: "info", title: 'Alert', text : 'User already exists!'})
                    break;
                case 2:
                    setDialogOptions({family: "info", title: 'Alert', text : 'User already exists! (nonActive)'})
                    break;
                default:
                    setDialogOptions({family: "info", title: 'Error', text : 'Error: ' + res.data.result.msg})
                    break;
            };
        } catch(err) {
            console.log('Err: ' + err);
        };
    };

    // JSX ######################################################################################################################################
    return (
        <ModalNew.ForForm isOpen={isOpen} closeModal={close}>
            <Container.Basic>
                <Title.Basic>{user.user_id === 0 ? 'New User' : 'Update User'}</Title.Basic>
                <Input2.Validation name="name" label="Name" register={register} error={errors.name} />
                <Input2.Validation name="email" label="Email" register={register} error={errors.email} />
                <Select2.Validation name="rol_id" label="Rol" placeholder="Select a rol" register={register} content={rols} error={errors.rol_id}/>
                <Button.Basic onClick={handleSubmit(updateUser)} margin="9px 0 0 0">Save</Button.Basic>
            </Container.Basic>
            
            {/* DIALOG ############################################################################################################################## */}
            <Dialog.Action options={ dialogOptions } close={() => setDialogOptions({})} />
        </ModalNew.ForForm>
    );
}

export default UserCrud;