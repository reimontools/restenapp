import { Container, Title } from "../component.controls";

export default function Home() {
    // const pais = [
    //    {paisId: 1, paisName: 'CHILE'},
    //    {paisId: 2, paisName: 'PERU'},
    //    {paisId: 3, paisName: 'ARGENTINA'}, 
    //    {paisId: 4, paisName: 'BOLIVIA'} 
    // ];

    const ciudadesArea = [
        {ciudadId: 1, paisId: 3, area: 12000},
        {ciudadId: 2, paisId: 2, area: 8000},
        {ciudadId: 3, paisId: 1, area: 2000},
        {ciudadId: 4, paisId: 4, area: 6000},
        {ciudadId: 5, paisId: 4, area: 1000},
        {ciudadId: 6, paisId: 2, area: 3000},
        {ciudadId: 7, paisId: 4, area: 7000},
        {ciudadId: 8, paisId: 1, area: 9000},
        {ciudadId: 9, paisId: 1, area: 10000},
        {ciudadId: 10, paisId: 4, area: 4000},
        {ciudadId: 11, paisId: 4, area: 11000},
        {ciudadId: 12, paisId: 4, area: 5000},
    ];

    const haceToaLaWea = () => {
        const result = {};

        ciudadesArea.forEach(ciudadArea => {
            const {paisId, area} = ciudadArea;
            result[paisId] = result[paisId] ?? 0;
            result[paisId] += area;
        })

        console.log(result)
    };


    const renderTitle = () => {
        haceToaLaWea();
        return <Title.Basic flexJustifyContent="flex-start" margin="13px 0 7px 0" width="90%">Home</Title.Basic>;
    };
    


    return (
        <Container.Primary>
            {renderTitle()}
        </Container.Primary>
    );
};