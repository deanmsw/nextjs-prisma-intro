import Head from 'next/head'
import { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css'

import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();

export default function Home({data}) {
  const [formData, setFormData] = useState({});
  const [movies, setMovies] = useState(data);

  async function saveMovie(e) {
    e.preventDefault()
    setMovies([...movies, formData]);
    const res = await fetch('/api/movies', {
      method: 'POST',
      body: JSON.stringify(formData)
    })

    return await res.JSON;
  }



  return (
    <div className={styles.container}>
      <Head>
        <title>Movie List</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <ul className={styles.movielist}>
            {movies.map(item => (
              <li key={item.id}> 
              <h1>{item.title}</h1>
              <h3>{item.year}</h3>
              <p>{item.description}</p>

              <Link href={`/movies/${item.slug}`}>
                  <a>More about this movie</a>
              </Link>

              </li> 
            ))}
        </ul>

        <form className={styles.movieform} onSubmit={saveMovie}>
          <input type="text" placeholder="Title" name="title" onChange={e => setFormData({ ...formData, title: e.target.value })}/>
          <input type="text" placeholder="Year" name="year" onChange={e => setFormData({ ...formData, year: +e.target.value })} />
          <textarea name="description" id="" cols="30" rows="10" placeholder="Description" onChange={e => setFormData({ ...formData, description: e.target.value })} />
          <input type="text" placeholder="Slug" name="slug" onChange={e => setFormData({ ...formData, slug: e.target.value })} />
          <button type="submit">Add movie</button>
        </form>
      </main>

  
    </div>
  )
}

export async function getServerSideProps() {
  
  const movies = await prisma.movie.findMany()

  return {
    props: {
      data: movies
    }
  }

}