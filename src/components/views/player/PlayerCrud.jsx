import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Container, ModalNew, Title, Button, Select2, Dialog, Input2 } from "../../component.controls";
import moment from 'moment';
import * as Yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import axios from '../../../config/axios'
import { getCapitalInSentence } from "../../../helpers/parameters.helper";
import { useGender } from "../../../custom-hooks/useGender";

const PlayerCrud = ({fetch, player, isOpen, close}) => {        
    // CUSTOM HOOKS #################################################################################################################################
    const { genders } = useGender("fetchGenders");

    // STATE ########################################################################################################################################
    const [dialogOptions, setDialogOptions] = useState({});

    // CRUD VALIDATIONS #############################################################################################################################
    const schema = Yup.object().shape({
        name: Yup.string()
            .required('Required !')
            .trim()
            .min(2, "Too short!")
            .transform(value => getCapitalInSentence(value)),
        surname: Yup.string()
            .required('Required !')
            .trim()
            .min(2, "Too short!")
            .transform(value => getCapitalInSentence(value)),
        birth_date: Yup
            .date()
            .nullable()
            .transform((curr, orig) => orig === '' ? null : curr)
            .max(moment().subtract(2, 'years').calendar(), "Too young")
            .min(moment().subtract(70, 'years').calendar(), "Too old")
            .required('Required'),
        gender_id: Yup.string()
            .required('Required!')
    });

    const { register, handleSubmit, errors, reset } = useForm({
        mode: 'onBlur',
        resolver: yupResolver(schema)
    });

    // EFFECT ###################################################################################################################################
    useEffect(() => reset(player), [player, reset]);

    // CRUD #####################################################################################################################################
    const updatePlayer = async data => {
        try {
            const res = await axios.post("player", {player_id: player.player_id, ...data});
            switch(res.data.result.cod) {
                case 0:
                    fetch();
                    close();
                    break;
                case 1:
                    setDialogOptions({family: "info", title: 'Alert', text : 'player already exists!'})
                    break;
                case 2:
                    setDialogOptions({family: "info", title: 'Alert', text : 'player already exists! (nonActive)'})
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
                <Title.Basic>{player.player_id === 0 ? 'New Player' : 'Update Player'}</Title.Basic>
                <Input2.Validation name="name" label="Name" register={register} error={errors.name} />
                <Input2.Validation name="surname" label="Surname" register={register} error={errors.surname} />
                <Select2.Validation name="gender_id" label="Gender" placeholder="Select a gender" register={register} content={genders} error={errors.gender_id}/>
                <Input2.DateValidation name="birth_date" label="Date of birth" register={register} error={errors.birth_date} />
                <Button.Basic onClick={handleSubmit(updatePlayer)} margin="9px 0 0 0">Save</Button.Basic>
            </Container.Basic>
            
            {/* DIALOG ############################################################################################################################## */}
            <Dialog.Action options={ dialogOptions } close={() => setDialogOptions({})} />
        </ModalNew.ForForm>
    );
}

export default PlayerCrud;