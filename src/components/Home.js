import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link } from 'react-router-dom';
// import Paper from '@material-ui/Paper';
import Image from '../img/home-background.jpg';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(20, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
}));


const Home = () => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h3" variant="h2" align="center" color="textPrimary" gutterBottom>
              Welcome to Alec and Calla's Collectibles!
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              Come check out the premier collectibles site on the world wide web, hand picked by our team of experts.  Peruse our catalog and check out some of our featured products below!
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button variant="contained" color="primary" component={Link} to="/catalog">
                    Collectible Catalog
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
      </main>
    </React.Fragment>
  );
}
export default Home;