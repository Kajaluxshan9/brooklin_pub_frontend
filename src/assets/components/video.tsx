import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';

const Home = () => {
  return (
    <div>
      <Card sx={{ width: '100vw', maxWidth: '100%', margin: 0, borderRadius: 0, boxShadow: 0 }}>
        <CardMedia
          component="video"
          src="https://www.w3schools.com/html/mov_bbb.mp4"
          autoPlay
          muted
          loop
          sx={{ 
            width: '100%',
            height: { xs: 300, sm: 500, md: 700 }, 
            minHeight: 200,                        
            objectFit: 'cover',
          }}
        />
      </Card>
    </div>
  );
};

export default Home;
