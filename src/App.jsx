import Masonry from 'react-masonry-css';
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);

  const accessKey = 'ownKPgq8gAYHbJlAApzmpPT5YOc-3HaCbiL6jz2dy6o';
  const url = `https://api.unsplash.com/search/photos?page=${page}&query=office&client_id=${accessKey}`;

  async function fetchingPhotos() {
    try {
      const response = await fetch(url);
      const data = await response.json();

      setPhotos(prev => {
        const combined = [...prev, ...data.results];
        // const unique = Array.from(new Map(combined.map(p => [p.id, p])).values());

        const unique = combined.filter((item, index, self) => {
          return index === self.findIndex(obj => obj.id === item.id);
        });
        return unique;
      });
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  }

  useEffect(() => {
    fetchingPhotos();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
      if (nearBottom) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="masonry-grid"
        columnClassName="masonry-column"
      >
        {photos.map(img => (
          <img
            key={img.id}
            src={img.urls.regular}
            className="gallery-img"
            alt={img.alt_description || 'Unsplash image'}
            loading='lazy'
            fetchPriority='low'
          />
        ))}
      </Masonry>

    </>
  );
}

export default App;
