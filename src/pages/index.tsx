import {useMemo} from "react";
import animes from '../../public/animes.json';
import {
    Bar,
    CartesianGrid,
    Legend,
    Tooltip,
    XAxis,
    YAxis,
    ResponsiveContainer,
    ComposedChart, Line, Brush
} from "recharts";
import dynamic from 'next/dynamic'
import Head from "next/head";

type Animes = typeof animes;

interface Data {
    title: string;
    score: number | string;
    animes: Animes;
    value: number;
}

const Home = () => {
    const genres = useMemo(() => {
        const genres = new Set<string>()
        const data: Array<Data> = []
        animes.forEach(anime => {
            anime.genres?.forEach(genre => {
                genres.add(genre);
            })
        })
        genres.forEach(genre => {
            const animesInGenre = animes.filter(anime => anime.genres?.includes(genre));
            const score = animesInGenre.reduce((prev, current) => prev + Number(current.score), 0) / animesInGenre.length;
            data.push({title: genre, score: score.toFixed(2), animes: animesInGenre, value: animesInGenre.length})
        })

        return data;
    }, [])

    return typeof window === 'undefined' ? <></> : <>
        <Head>
            <title>Anime Genres</title>
        </Head>

        <ResponsiveContainer width='100%' minHeight={500}>
            <ComposedChart data={genres} margin={{top: 32, right: 32, left: 32, bottom: 32}}>
                <CartesianGrid strokeDasharray="3 3"/>
                <YAxis yAxisId='left' type='number'
                       domain={[(dataMin: number) => Math.floor(dataMin), (dataMax: number) => Math.ceil(dataMax)]}
                       stroke='#8884d8'/>
                <YAxis yAxisId='right' orientation='right' type='number' stroke='#82ca9d'/>
                <XAxis type='category' dataKey="title"/>
                <Tooltip/>
                <Legend verticalAlign="top" height={36}/>
                <Brush dataKey="title" height={64} stroke="#8884d8"/>
                <Bar yAxisId="left" dataKey="score" fill="#8884d8" name='Calificación Promedio'/>
                <Line yAxisId="right" type="monotone" dataKey="value" stroke="#82ca9d" strokeWidth={6}
                      name='Cantidad de Animes'/>
            </ComposedChart>
        </ResponsiveContainer>
    </>
}

export default dynamic(() => Promise.resolve(Home), {
    ssr: false
})
