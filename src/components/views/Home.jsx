import useList from '../../hooks/useList';

export default function Home() {
    const casos = useList("list/user-type");
    console.log(casos);
    return (
        <h1>Home</h1>
    );
};