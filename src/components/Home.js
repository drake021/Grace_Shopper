import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link } from 'react-router-dom';
import Image from '../img/background2.jpg';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles((theme) => ({
  "@global": {
    main: {
      backgroundImage: `url(${Image})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center center",
      backgroundSize: "cover",
      backgroundAttachment: "fixed",
      height: "100%"
    },
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    padding: theme.spacing(40, 0, 35),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  homeCard: {
    minWidth: 600,

  },
}));


const Home = () => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent} >
          <Container maxWidth="sm">
            <Card className={classes.homeCard} variant="outlined">
              <CardContent>
                <Typography component="h3" variant="h3" align="center" color="textPrimary" gutterBottom>
                  Welcome to Superhero Collectibles!
            </Typography>
                <Typography variant="h5" align="center" color="textSecondary" paragraph>
                  View our catalog of some of the rarest collectibes on the internet, that can only be found here.
            </Typography>
              </CardContent>
            </Card>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button variant="contained" component={Link} to="/catalog">
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